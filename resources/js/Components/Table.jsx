import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Search, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Table({
    data,
    columns,
    searchable = true,
    searchPlaceholder = 'Buscar...',
    sortable = true,
    emptyMessage = 'No hay datos disponibles',
}) {
    const [search, setSearch] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    // Filtrar datos en el cliente (INSTANTÁNEO)
    const filteredData = useMemo(() => {
        if (!search || !data.data) return data.data || [];

        const searchLower = search.toLowerCase();

        return data.data.filter((row) => {
            return columns.some((column) => {
                // Obtener el valor de la celda
                let value = row[column.key];

                // Si tiene render personalizado, extraer el texto
                if (column.render && column.searchKey) {
                    value = row[column.searchKey];
                }

                // Si es un objeto (relación), buscar en sus propiedades
                if (typeof value === 'object' && value !== null) {
                    return Object.values(value).some(v => 
                        String(v).toLowerCase().includes(searchLower)
                    );
                }

                return String(value || '').toLowerCase().includes(searchLower);
            });
        });
    }, [data.data, search, columns]);

    // Ordenar datos en el cliente
    const sortedData = useMemo(() => {
        if (!sortColumn || !filteredData) return filteredData;

        const sorted = [...filteredData].sort((a, b) => {
            let aVal = a[sortColumn];
            let bVal = b[sortColumn];

            // Manejar objetos (relaciones)
            if (typeof aVal === 'object' && aVal !== null) {
                aVal = Object.values(aVal).join(' ');
            }
            if (typeof bVal === 'object' && bVal !== null) {
                bVal = Object.values(bVal).join(' ');
            }

            // Convertir a string para comparar
            aVal = String(aVal || '').toLowerCase();
            bVal = String(bVal || '').toLowerCase();

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return sorted;
    }, [filteredData, sortColumn, sortDirection]);

    const handleSort = (column) => {
        if (!sortable || !column.sortable) return;

        if (sortColumn === column.key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column.key);
            setSortDirection('asc');
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Búsqueda - INSTANTÁNEA */}
            {searchable && (
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-base placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {search && (
                        <p className="mt-2 text-sm text-gray-600">
                            {sortedData.length} resultado{sortedData.length !== 1 ? 's' : ''} encontrado{sortedData.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            )}

            {/* Tabla */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-900">
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        onClick={() => handleSort(column)}
                                        className={cn(
                                            'px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-white',
                                            column.sortable && sortable && 'cursor-pointer select-none hover:bg-gray-800 transition-colors'
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{column.label}</span>
                                            {column.sortable && sortable && (
                                                <div className="flex flex-col">
                                                    {sortColumn === column.key ? (
                                                        sortDirection === 'asc' ? (
                                                            <ChevronUp className="h-4 w-4 text-primary-400" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-primary-400" />
                                                        )
                                                    ) : (
                                                        <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sortedData && sortedData.length > 0 ? (
                                sortedData.map((row, index) => (
                                    <tr 
                                        key={row.id || index} 
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {columns.map((column) => (
                                            <td 
                                                key={column.key} 
                                                className="px-6 py-4 text-base text-gray-900"
                                            >
                                                {column.render ? column.render(row) : row[column.key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td 
                                        colSpan={columns.length} 
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="rounded-full bg-gray-100 p-3">
                                                <Search className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-base font-medium text-gray-900">
                                                {search ? 'No se encontraron resultados' : emptyMessage}
                                            </p>
                                            {search && (
                                                <p className="text-sm text-gray-500">
                                                    Intenta con otros términos de búsqueda
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Información de resultados */}
                {sortedData && sortedData.length > 0 && (
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <p className="text-base text-gray-700">
                            Mostrando <span className="font-medium">{sortedData.length}</span> de{' '}
                            <span className="font-medium">{data.total || data.data?.length || 0}</span> resultados
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}