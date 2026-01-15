export type Database = {
    public: {
        Tables: {
        profiles: {
            Row: {
            id: string
            firstname: string | null
            lastname: string | null
            username: string | null
            role: number | null
            }
            Insert: {
            id: string
            firstname?: string | null
            lastname?: string | null
            username?: string | null
            role?: number | null
            }
            Update: {
            firstname?: string | null
            lastname?: string | null
            username?: string | null
            role?: number | null
            }
        }
        }
    }
}
