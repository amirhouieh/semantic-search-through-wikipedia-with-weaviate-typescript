import {WeaviateClass} from "weaviate-ts-client";
import {definitions} from "weaviate-ts-client/types/openapi/schema";
import {intersects} from "../utils/arrays.utils";

type WeaviateProperty = definitions['Property'];

export function getNoneReferenceProperties(properties: WeaviateProperty[], allAvailableClassesInSchema: WeaviateClass[]): WeaviateProperty[]{
    const allClassNames = allAvailableClassesInSchema.map(c => c.class) as string[];
    return (properties || [])
        .filter((p)=> intersects(p.dataType||[], allClassNames).length === 0)
}

export function getReferenceProperties(properties: WeaviateProperty[], allAvailableClassesInSchema: WeaviateClass[]): WeaviateProperty[]{
    const allClassNames = allAvailableClassesInSchema.map(c => c.class) as string[];
    return (properties || [])
        .filter((p)=> intersects(p.dataType||[], allClassNames).length > 0)
}
