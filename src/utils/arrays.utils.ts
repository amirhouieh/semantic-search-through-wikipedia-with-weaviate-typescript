export function intersects(a: string[], b: string[]): string[]{
    return a.filter((value) => b.includes(value));
}
