'use client'

import { useState } from 'react'
import { Button3 } from "@/components/ui/button3"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    SearchIcon,
} from 'lucide-react'



export default function AdminRecent({ logData }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [logsPerPage, setLogsPerPage] = useState(5)
    const [searchTerm, setSearchTerm] = useState('')
    const [STATUSFilter, setSTATUSFilter] = useState('all')

    // Filter and search logs
    const filteredLogs = logData.filter(log =>
       
        (STATUSFilter === 'all' || log.STATUS.toLowerCase() === STATUSFilter) &&
        (log.MESSAGE.toLowerCase().includes(searchTerm.toLowerCase()) ||
            
            log.STATUS.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
    const indexOfLastLog = currentPage * logsPerPage
    const indexOfFirstLog = indexOfLastLog - logsPerPage
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            
            <main className="flex-1 overflow-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      
                        <Select value={STATUSFilter} onValueChange={setSTATUSFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by STATUS" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All STATUS</SelectItem>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            TYPE="text"
                            placeholder="Search logs..."
                            className="w-[300px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button3 variant="outline" size="icon">
                            <SearchIcon className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button3>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">LOG_TIMESTAMP</TableHead>
                                <TableHead>TYPE</TableHead>
                                <TableHead className="max-w-[500px]">MESSAGE</TableHead>
                                <TableHead>STATUS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentLogs.map((log) => (
                                <TableRow key={log.ID}>
                                    <TableCell className="font-mono">{new Date(log.LOG_TIMESTAMP).toLocaleString()}</TableCell>
                                    <TableCell>{log.TYPE}</TableCell>
                                    <TableCell className="max-w-[500px] truncate">{log.MESSAGE}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${log.STATUS === 'INFO' ? 'bg-blue-100 text-blue-800' :
                                                log.STATUS === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                                    log.STATUS === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {log.STATUS}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">
                            Showing page {currentPage} of {totalPages}
                        </p>
                        <Select
                            value={logsPerPage.toString()}
                            onValueChange={(value) => {
                                setLogsPerPage(Number(value))
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Logs per page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 per page</SelectItem>
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="20">20 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button3
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                            <span className="sr-only">Previous page</span>
                        </Button3>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button3
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button3>
                        ))}
                        <Button3
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                            <span className="sr-only">Next page</span>
                        </Button3>
                    </div>
                </div>
            </main>
        </div>
    )
}