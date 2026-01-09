import { NextResponse } from "next/server";
import { getPool } from "@/infrastructure/database/connection";
import { requireAuth } from "@/infrastructure/http/middleware/auth";

export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request as any);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".csv")) {
      return NextResponse.json(
        {
          success: false,
          message: "Por favor, use arquivo CSV (delimitado por vírgula)",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const text = buffer.toString("utf-8");
    const professionals = parseCSV(text);

    if (professionals.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nenhum dado encontrado no arquivo" },
        { status: 400 }
      );
    }

    const pool = getPool();
    let insertedCount = 0;
    let updatedCount = 0;
    const errors: string[] = [];
    const batchSize = 100;
    
    for (let batchStart = 0; batchStart < professionals.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, professionals.length);
      const batch = professionals.slice(batchStart, batchEnd);
      const client = await pool.connect();
      
      try {
        await client.query("BEGIN");

        for (const prof of batch) {
          try {
            const result = await client.query(
              `INSERT INTO professionals (name, cpf, registration_number, status, formation, city, state, registration_date)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
               ON CONFLICT (cpf) 
               DO UPDATE SET 
                 name = EXCLUDED.name,
                 registration_number = EXCLUDED.registration_number,
                 status = EXCLUDED.status,
                 formation = EXCLUDED.formation,
                 city = EXCLUDED.city,
                 state = EXCLUDED.state,
                 registration_date = EXCLUDED.registration_date,
                 updated_at = CURRENT_TIMESTAMP
               RETURNING (xmax = 0) AS inserted`,
              [
                prof.name,
                prof.cpf,
                prof.registrationNumber,
                prof.status,
                prof.formation,
                prof.city,
                prof.state,
                prof.registrationDate,
              ]
            );

            if (result.rows[0].inserted) {
              insertedCount++;
            } else {
              updatedCount++;
            }
          } catch (error: any) {
            errors.push(`${prof.name}: ${error.message}`);
            throw error;
          }
        }

        await client.query("COMMIT");
      } catch (error: any) {
        await client.query("ROLLBACK");
      } finally {
        client.release();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Importação concluída: ${insertedCount} novos, ${updatedCount} atualizados`,
      data: {
        total: professionals.length,
        inserted: insertedCount,
        updated: updatedCount,
        errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao importar arquivo",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

function parseCSV(text: string): any[] {
  const lines = text.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const professionals = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",").map((v) => v.trim());
    if (values.length < 9) continue;

    try {
      const cpf = values[1].replace(/\D/g, "");
      const dateStr = values[8].trim();
      let registrationDate: Date;

      if (!dateStr || dateStr === '') {
        registrationDate = new Date();
      } else {
        const dateParts = dateStr.split("/");
        
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          
          if (!day || !month || !year || isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
            registrationDate = new Date();
          } else {
            registrationDate = new Date(`${year}-${month}-${day}`);
            if (isNaN(registrationDate.getTime())) {
              registrationDate = new Date();
            }
          }
        } else {
          registrationDate = new Date();
        }
      }

      professionals.push({
        name: values[0],
        cpf: cpf,
        registrationNumber: values[2],
        status: values[3],
        formation: values[5],
        city: values[6],
        state: values[7],
        registrationDate: registrationDate,
      });
    } catch (error) {
      // Ignora linha com erro
    }
  }

  return professionals;
}
