type Config = {
    apiUrl: string;
}

export const config: Config = {
    apiUrl: process.env.POKE_API_URL
}