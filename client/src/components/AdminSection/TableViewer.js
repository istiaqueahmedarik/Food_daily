import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Label } from '../ui/label'




export default function TableViewer({ data  }) {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">No data available.</p>
    }

    const columns = Object.keys(data[0])

    return (
        <div className="border rounded-lg">
            <Label htmlFor="generated-sql">Generated Table</Label>

            <ScrollArea className="h-[400px] w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column} className="px-4 py-2 text-left font-bold sticky top-0 bg-background">
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                                {columns.map((column) => (
                                    <TableCell key={`${index}-${column}`} className="px-4 py-2">
                                        {formatCellValue(row[column])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}
var isDate = function (date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}
function formatCellValue(value) {
    if (value === null || value === undefined) {
        return 'N/A'
    }
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'
    }
    if (isDate(value)) {
        return new Date(value).toLocaleString()
    }
    return String(value)
}