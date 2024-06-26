import { Request, Response } from 'express'; // Importa Request también si lo necesitas
import * as foodServices from '../services/foodServices';

export const getFoodFiltro = async (_req: Request, res: Response) => {
    try {
        // Extraer parámetros de la solicitud
        const { pais, tipo } = _req.query;; // Suponiendo que los parámetros se envían en el cuerpo de la solicitud

        // Lógica de filtrado basada en los parámetros recibidos
        let finalResponse = await foodServices.getEntriesWithoutSensitiveInfo();
        finalResponse.sort((a : any, b :any) => {
            // Convertir los nombres a minúsculas para un ordenamiento sin distinción de mayúsculas/minúsculas
            const nombreA = a.nombre.toLowerCase();
            const nombreB = b.nombre.toLowerCase();
            // Comparar los nombres y devolver el resultado de la comparación
            if (nombreA < nombreB) return -1;
            if (nombreA > nombreB) return 1;
            return 0;
        });

        // Aplicar filtros según los parámetros recibidos
        if (pais != "Todos") {
            // Filtrar por país si el parámetro está presente
            finalResponse = finalResponse.filter((character) => character.origen === pais);
        }
        if (tipo != "Todosa"){
            // Filtrar por tipo si el parámetro está presente
            finalResponse = finalResponse.filter((character) => character.tipo === tipo);
        }
        // Devolver la respuesta filtrada
        return res.send(finalResponse);
    } catch (error) {
        return res.status(500).json({ error: 'Error searching for Foods.' });
    }
};