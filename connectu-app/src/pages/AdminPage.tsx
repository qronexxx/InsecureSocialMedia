import React, { useState } from 'react'
import API_BASE from '../api'

const AdminPage: React.FC = () => {
  const [sql, setSql] = useState('')
  const [output, setOutput] = useState('')

  const onExecute = async () => {
    const trimmed = sql.trim()
    if (!trimmed) {
      setOutput('Bitte ein SQL-Statement eingeben.')
      return
    }
    try {
      setOutput('Sende Anfrage...')
      const res = await fetch(`${API_BASE}/api/admin/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: trimmed }),
      })

      const text = await res.text()
      // Versuche JSON zu parsen, sonst rohen Text zeigen
      let data: any
      try { data = JSON.parse(text) } catch { data = text }

      if (!res.ok) {
        setOutput(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
        return
      }

      setOutput(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    } catch (e: any) {
      setOutput(`Fehler: ${e?.message || e}`)
    }
  }

  return (
    <main className="flex-grow container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg shadow-gray-200/50">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Console</h1>
          <p className="text-gray-500 mb-6">
            Execute SQL commands directly on the database.
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="sql-command"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                SQL Command
              </label>
              <textarea
                id="sql-command"
                name="sql-command"
                rows={8}
                className="form-input w-full rounded-lg bg-gray-50 border-gray-300 focus:ring-primary focus:border-primary shadow-sm text-sm font-mono"
                placeholder="SELECT * FROM users WHERE status = 'active';"
                value={sql}
                onChange={(e) => setSql(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onExecute}
                className="bg-primary text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Execute
              </button>
            </div>

            <div>
              <label
                htmlFor="sql-output"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Output
              </label>
              <textarea
                id="sql-output"
                name="sql-output"
                readOnly
                className="form-input w-full h-48 rounded-lg bg-gray-50 border-gray-300 shadow-sm text-sm font-mono p-4 resize-none"
                placeholder="Command output will be displayed here..."
                value={output}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}



export default AdminPage