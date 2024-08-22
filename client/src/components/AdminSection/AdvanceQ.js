'use client'

import { useState } from 'react'
import { Button3 } from "@/components/ui/button3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, MinusIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import TableViewer from './TableViewer'
import { runQuery } from '@/action'
import { toast, useToast } from '../ui/use-toast'
import { ToastAction } from '../ui/toast'



const aggregateFunctions = ['NONE', 'COUNT', 'AVG', 'SUM', 'MAX', 'MIN']

const QueryBuilder = ({ tableSchemas, query, updateQuery, depth = 0, parentColumns = [], parentSubqueries = [] }) => {
    const { toast } = useToast()
    const [isExpanded, setIsExpanded] = useState(true)

    const handleTableToggle = (table) => {
        updateQuery({
            ...query,
            selectedTables: query.selectedTables.includes(table)
                ? query.selectedTables.filter(t => t !== table)
                : [...query.selectedTables, table],
            selectedColumns: query.selectedTables.includes(table)
                ? query.selectedColumns.filter(col => !col.column.startsWith(`${table}.`))
                : query.selectedColumns
        })
    }

    const handleColumnToggle = (table, column) => {
        const fullColumn = `${table}.${column}`
        const isSelected = query.selectedColumns.some(col => col.column === fullColumn)

        let updatedColumns
        if (isSelected) {
            updatedColumns = query.selectedColumns.filter(col => col.column !== fullColumn)
        } else {
            updatedColumns = [...query.selectedColumns, { column: fullColumn, alias: '', aggregate: '' }]
        }

        updateQuery({
            ...query,
            selectedColumns: updatedColumns,
            groupBy: query.groupBy.filter(col => col !== fullColumn),
            orderBy: query.orderBy.filter(order => order.column !== fullColumn)
        })
    }

    const updateColumnAlias = (column, alias) => {
        updateQuery({
            ...query,
            selectedColumns: query.selectedColumns.map(col =>
                col.column === column ? { ...col, alias } : col
            )
        })
    }

    const updateColumnAggregate = (column, aggregate) => {
        updateQuery({
            ...query,
            selectedColumns: query.selectedColumns.map(col =>
                col.column === column ? { ...col, aggregate: aggregate === 'NONE' ? '' : aggregate } : col
            )
        })
    }
    const addCondition = () => {
        updateQuery({
            ...query,
            conditions: [...query.conditions, { table: '', column: '', operator: '=', value: '' }]
        })
    }

    const updateCondition = (index, field, value) => {
        const updatedConditions = [...query.conditions]
        updatedConditions[index][field] = value
        updateQuery({ ...query, conditions: updatedConditions })
    }

    const removeCondition = (index) => {
        updateQuery({
            ...query,
            conditions: query.conditions.filter((_, i) => i !== index)
        })
    }

    const addJoin = () => {
        updateQuery({
            ...query,
            joins: [...query.joins, { type: 'INNER JOIN', table1: '', column1: '', table2: '', column2: '' }]
        })
    }

    const updateJoin = (index, field, value) => {
        const updatedJoins = [...query.joins]
        updatedJoins[index][field] = value

        if (field === 'table1' || field === 'table2') {
            updatedJoins[index][field === 'table1' ? 'column1' : 'column2'] = ''
        }

        updateQuery({ ...query, joins: updatedJoins })
    }


    const removeJoin = (index) => {
        updateQuery({
            ...query,
            joins: query.joins.filter((_, i) => i !== index)
        })
    }

    const addOrderBy = () => {
        updateQuery({
            ...query,
            orderBy: [...query.orderBy, { column: '', direction: 'ASC' }]
        })
    }

    const updateOrderBy = (index, field, value) => {
        const updatedOrderBy = [...query.orderBy]
        updatedOrderBy[index][field] = value
        updateQuery({ ...query, orderBy: updatedOrderBy })
    }

    const removeOrderBy = (index) => {
        updateQuery({
            ...query,
            orderBy: query.orderBy.filter((_, i) => i !== index)
        })
    }

    const addGroupBy = () => {
        updateQuery({
            ...query,
            groupBy: [...query.groupBy, '']
        })
    }

    const updateGroupBy = (index, value) => {
        const updatedGroupBy = [...query.groupBy]
        updatedGroupBy[index] = value
        updateQuery({ ...query, groupBy: updatedGroupBy })
    }

    const removeGroupBy = (index) => {
        updateQuery({
            ...query,
            groupBy: query.groupBy.filter((_, i) => i !== index)
        })
    }

    const addSubquery = () => {
        updateQuery({
            ...query,
            subqueries: [...query.subqueries, { alias: '', query: createEmptyQuery() }]
        })
    }

    const updateSubquery = (index, field, value) => {
        const updatedSubqueries = [...query.subqueries]
        if (field === 'query') {
            updatedSubqueries[index][field] = value
        } else {
            updatedSubqueries[index][field] = value
        }
        updateQuery({ ...query, subqueries: updatedSubqueries })
    }

    const removeSubquery = (index) => {
        updateQuery({
            ...query,
            subqueries: query.subqueries.filter((_, i) => i !== index)
        })
        parentSubqueries.filter((_, i) => i !== index)
        
    }
    const getAvailableColumns = () => {
        const columns = query.selectedColumns.map(col => ({
            value: col.column,
            label: col.alias || col.column
        }))
        console.log(columns)

        const subqueryColumns = query.subqueries.flatMap(sq =>
            sq.query.selectedColumns.map(col => ({
                value: `${sq.alias}.${col.alias || col.column}`,
                label: `${sq.alias}.${col.alias || col.column}`
            }))
        )
        console.log([...columns, ...subqueryColumns, ...parentColumns])

        return [...columns, ...subqueryColumns, ...parentColumns]
    }
    const getAvailableTables = () => {
        const tables = query.selectedTables.map(table => ({
            value: table,
            label: table
        }))

        const subqueries = query.subqueries.map(sq => ({
            value: sq.alias,
            label: sq.alias
        }))

        return [...tables, ...subqueries, ...parentSubqueries]
    }
    
    return (
        <Card className={`mt-4 ${depth > 0 ? 'border-l-4 border-l-primary' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {depth === 0 ? 'Main Query' : `Subquery ${depth}`}
                </CardTitle>
                <Button3 variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                </Button3>
            </CardHeader>
            {isExpanded && (
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label>Select Tables</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.keys(tableSchemas).map(table => (
                                    <div key={table} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`table-${depth}-${table}`}
                                            checked={query.selectedTables.includes(table)}
                                            onCheckedChange={() => handleTableToggle(table)}
                                        />
                                        <Label htmlFor={`table-${depth}-${table}`}>{table}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {query.selectedTables.length > 0 && (
                            <div>
                                <Label>Select Columns</Label>
                                <div className="grid gap-2">
                                    {query.selectedTables.map(table =>
                                        tableSchemas[table].map(column => {
                                            const fullColumn = `${table}.${column}`
                                            const selectedColumn = query.selectedColumns.find(col => col.column === fullColumn)
                                            return (
                                                <div key={`${table}.${column}`} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`column-${depth}-${table}-${column}`}
                                                        checked={!!selectedColumn}
                                                        onCheckedChange={() => handleColumnToggle(table, column)}
                                                    />
                                                    <Label htmlFor={`column-${depth}-${table}-${column}`}>{`${table}.${column}`}</Label>
                                                    {selectedColumn && (
                                                        <>
                                                            <Select
                                                                value={selectedColumn.aggregate || 'NONE'}
                                                                onValueChange={(value) => updateColumnAggregate(fullColumn, value)}
                                                            >
                                                                <SelectTrigger className="w-[120px]">
                                                                    <SelectValue placeholder="Aggregate" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {aggregateFunctions.map(func => (
                                                                        <SelectItem key={func} value={func}>{func === 'NONE' ? 'None' : func}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Input
                                                                placeholder="Alias"
                                                                value={selectedColumn.alias}
                                                                onChange={(e) => updateColumnAlias(fullColumn, e.target.value)}
                                                                className="w-32"
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <Label>Joins</Label>
                            {query.joins.map((join, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-2">
                                    <Select value={join.type} onValueChange={(value) => updateJoin(index, 'type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Join Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'].map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={join.table1} onValueChange={(value) => updateJoin(index, 'table1', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Table 1" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableTables().map(table => (
                                                <SelectItem key={table.value} value={table.value}>{table.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={join.column1} onValueChange={(value) => updateJoin(index, 'column1', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Column 1" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {join.table1 && (
                                                tableSchemas[join.table1]
                                                    ? tableSchemas[join.table1].map(column => (
                                                        <SelectItem key={column} value={column}>{column}</SelectItem>
                                                    ))
                                                    : getAvailableColumns()
                                                        .filter(col => col.label.startsWith(`${join.table1}.`))
                                                        .map(col => (
                                                            <SelectItem key={col.value} value={col.value}>{col.value}</SelectItem>
                                                        ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <Select value={join.table2} onValueChange={(value) => updateJoin(index, 'table2', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Table 2" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableTables().map(table => (
                                                <SelectItem key={table.value} value={table.value}>{table.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={join.column2} onValueChange={(value) => updateJoin(index, 'column2', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Column 2" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {join.table2 && (
                                                tableSchemas[join.table2]
                                                    ? tableSchemas[join.table2].map(column => (
                                                        <SelectItem key={column} value={column}>{column}</SelectItem>
                                                    ))
                                                    : getAvailableColumns()
                                                        .filter(col => col.label.startsWith(`${join.table2}.`))
                                                        .map(col => (
                                                            <SelectItem key={col.value} value={col.value}>{col.label}</SelectItem>
                                                        ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <Button3 variant="destructive" size="icon" onClick={() => removeJoin(index)}>
                                        <MinusIcon className="h-4 w-4" />
                                    </Button3>
                                </div>
                            ))}
                            <Button3 onClick={addJoin} className="mt-2">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Join
                            </Button3>
                        </div>

                        <div>
                            <Label>Conditions</Label>
                            {query.conditions.map((condition, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-2">
                                    <Select value={condition.table} onValueChange={(value) => updateCondition(index, 'table', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Table" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {query.selectedTables.map(table => (
                                                <SelectItem key={table} value={table}>{table}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={condition.column} onValueChange={(value) => updateCondition(index, 'column', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Column" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {condition.table && tableSchemas[condition.table].map(column => (
                                                <SelectItem key={column} value={column}>{column}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={condition.operator} onValueChange={(value) => updateCondition(index, 'operator', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Operator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['=', '!=', '>', '<', '>=', '<=', 'LIKE'].map(op => (
                                                <SelectItem key={op} value={op}>{op}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        placeholder="Value"
                                        value={condition.value}
                                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                                    />
                                    <Button3 variant="destructive" size="icon" onClick={() => removeCondition(index)}>
                                        <MinusIcon className="h-4 w-4" />
                                    </Button3>
                                </div>
                            ))}
                            <Button3 onClick={addCondition} className="mt-2">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Condition
                            </Button3>
                        </div>

                        <div>
                            <Label>Group By</Label>
                            {query.groupBy.map((column, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-2">
                                    <Select value={column} onValueChange={(value) => updateGroupBy(index, value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Column" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableColumns()
                                                .map(col => (
                                                    <SelectItem key={col.value} value={col.value}>{col.label}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <Button3 variant="destructive" size="icon" onClick={() => removeGroupBy(index)}>
                                        <MinusIcon className="h-4 w-4" />
                                    </Button3>
                                </div>
                            ))}
                            <Button3 onClick={addGroupBy} className="mt-2">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Group By
                            </Button3>
                        </div>

                        <div>
                            <Label>Order By</Label>
                            {query.orderBy.map((order, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-2">
                                    <Select value={order.column} onValueChange={(value) => updateOrderBy(index, 'column', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Column" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableColumns().map(col => (
                                                <SelectItem key={col.value} value={col.value}>{col.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={order.direction} onValueChange={(value) => updateOrderBy(index, 'direction', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Direction" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ASC">Ascending</SelectItem>
                                            <SelectItem value="DESC">Descending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button3 variant="destructive" size="icon" onClick={() => removeOrderBy(index)}>
                                        <MinusIcon className="h-4 w-4" />
                                    </Button3>
                                </div>
                            ))}
                            <Button3 onClick={addOrderBy} className="mt-2">
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Add Order By
                            </Button3>
                        </div>

                        {depth < 2 && (
                            <div>
                                <Label>Subqueries<sup>beta</sup></Label>
                                {query.subqueries.map((subquery, index) => (
                                    <div key={index} className="space-y-2 mt-2">
                                        <Input
                                            placeholder="Subquery Alias"
                                            value={subquery.alias}
                                            onChange={(e) => updateSubquery(index, 'alias', e.target.value)}
                                        />
                                        <QueryBuilder
                                            tableSchemas={tableSchemas}
                                            query={subquery.query}
                                            updateQuery={(newSubquery) => updateSubquery(index, 'query', newSubquery)}
                                            depth={depth + 1}
                                            parentColumns={getAvailableColumns()}
                                            parentSubqueries={getAvailableTables()}
                                        />
                                        <Button3 variant="destructive" onClick={() => removeSubquery(index)}>
                                            Remove Subquery
                                        </Button3>
                                    </div>
                                ))}
                                <Button3 onClick={addSubquery} className="mt-2">
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Add Subquery
                                </Button3>
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

const createEmptyQuery = () => ({
    selectedTables: [],
    selectedColumns: [],
    conditions: [],
    joins: [],
    groupBy: [],
    orderBy: [],
    subqueries: []
})

const generateSQL = (tableSchemas ,query, isSubquery = false) => {
    if (query.selectedTables.length === 0 && query.subqueries.length === 0) {
        return ''
    }

    let sql = '';
    if (query.selectedColumns.length > 0) {
        const hasAggregates = query.selectedColumns.some(col => col.aggregate)
        sql = 'SELECT ' + query.selectedColumns.map(col => {
            let columnSql = col.column
            if (col.aggregate) {
                columnSql = `${col.aggregate}(${columnSql})`
            }
            if (col.alias) {
                columnSql += ` AS ${col.alias}`
            }
            return columnSql
        }).join(', ');
    }
    else {
        sql = 'SELECT *'
    }

    // Add subqueries
    if (query.subqueries.length > 0) {
        sql += ', ' + query.subqueries.map(sq => `(${generateSQL(tableSchemas , sq.query, true)}) AS ${sq.alias}`).join(', ')
    }

    if (query.selectedTables.length > 0) {
        sql += ` FROM ${query.selectedTables[0]}`
    } else if (query.subqueries.length > 0) {
        sql += ` FROM (${generateSQL(tableSchemas , query.subqueries[0].query, true)}) AS ${query.subqueries[0].alias}`
    }

    // Add joins
    if (query.joins.length > 0) {
        sql += ' ' + query.joins.map(j => {
            let joinSql = `${j.type} ${j.table2}`
            if (tableSchemas[j.table2]) {
                joinSql += ` ON ${j.table1}.${j.column1} = ${j.table2}.${j.column2}`
            } else {
                joinSql += ` ON ${j.column1} = ${j.column2}`
            }
            return joinSql
        }).join(' ')
    }


    // Add conditions
    if (query.conditions.length > 0) {
        const whereClause = query.conditions
            .filter(c => c.table && c.column && c.operator && c.value)
            .map(c => `${c.table}.${c.column} ${c.operator} '${c.value}'`)
            .join(' AND ')
        if (whereClause) {
            sql += ` WHERE ${whereClause}`
        }
    }

    // Add GROUP BY
    if (query.groupBy.length > 0) {
        sql += ` GROUP BY ${query.groupBy.join(', ')}`
    }

    // Add ORDER BY
    if (query.orderBy.length > 0) {
        const orderByClause = query.orderBy
            .filter(o => o.column)
            .map(o => `${o.column} ${o.direction}`)
            .join(', ')
        if (orderByClause) {
            sql += ` ORDER BY ${orderByClause}`
        }
    }

    return isSubquery ? sql : sql + ';'
}

export default function AdvanceQ({ tables }) {
    const tableSchemas = []
    tables.forEach(table => {
        tableSchemas[table.TABLE_NAME.toLowerCase()] = table.COLUMNS.split(',')
    })
    const [mainQuery, setMainQuery] = useState(createEmptyQuery())
    const [generatedSQL, setGeneratedSQL] = useState('')
    const [queryResult, setQueryResult] = useState([])
    const handleGenerateSQL = async () => {
        setGeneratedSQL(generateSQL(tableSchemas,mainQuery))
        await runQuery(generateSQL(tableSchemas ,mainQuery)).then((res) => {
            if (res.error)
            {
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: res.error,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
            }
            else {
                setQueryResult(res.result)
                toast({
                    title: "Query executed successfully",
                    description: `Query returned ${res.result.length} rows and taken ${res.time} ms`,
                    action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
                })
            }
            
        })
    }
    return (
        <div className="container mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Advanced SQL Query Builder with Aggregate Functions</CardTitle>
                    <CardDescription>Build complex SQL queries with multiple tables, joins, aggregate functions, and interactive subqueries</CardDescription>
                </CardHeader>
                <CardContent>
                    <QueryBuilder tableSchemas={tableSchemas} query={mainQuery} updateQuery={setMainQuery} />
                    <Button3 onClick={handleGenerateSQL} className="mt-4">Generate SQL</Button3>
                    <div className="mt-4">
                        
                        <TableViewer data={queryResult} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}