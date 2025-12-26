import * as SQLite from 'expo-sqlite';

export interface Account {
    id: number;
    name: string;
    email: string;
    password?: string;
    website?: string;
    tags?: string; // Stored as comma-separated string
    icon?: string; // Identifier for the service icon
}

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
    if (db) return db;
    db = await SQLite.openDatabaseAsync('safekey.db');

    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT,
      website TEXT,
      tags TEXT,
      icon TEXT
    );
  `);

    // Migration to add icon column if it doesn't exist (for existing databases)
    try {
        await db.execAsync("ALTER TABLE accounts ADD COLUMN icon TEXT;");
    } catch (e) {
        // Column might already exist, ignore error
    }

    return db;
}

export async function addAccount(account: Omit<Account, 'id'>) {
    const database = await getDatabase();
    const result = await database.runAsync(
        'INSERT INTO accounts (name, email, password, website, tags, icon) VALUES (?, ?, ?, ?, ?, ?)',
        [account.name, account.email, account.password || '', account.website || '', account.tags || '', account.icon || '']
    );
    return result.lastInsertRowId;
}

export async function getAccounts(): Promise<Account[]> {
    const database = await getDatabase();
    return await database.getAllAsync<Account>('SELECT * FROM accounts ORDER BY name ASC');
}

export async function getAccountById(id: number): Promise<Account | null> {
    const database = await getDatabase();
    return await database.getFirstAsync<Account>('SELECT * FROM accounts WHERE id = ?', [id]);
}

export async function deleteAccount(id: number) {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM accounts WHERE id = ?', [id]);
}

export async function updateAccount(account: Account) {
    const database = await getDatabase();
    await database.runAsync(
        'UPDATE accounts SET name = ?, email = ?, password = ?, website = ?, tags = ?, icon = ? WHERE id = ?',
        [account.name, account.email, account.password || '', account.website || '', account.tags || '', account.icon || '', account.id]
    );
}
