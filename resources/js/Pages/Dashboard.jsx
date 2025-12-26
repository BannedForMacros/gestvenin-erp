import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* Header con título y acciones rápidas */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Resumen de tu restaurante hoy
                    </p>
                </div>
                <button className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600">
                    Nueva Orden
                </button>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Ventas Hoy"
                    value="S/ 2,847.50"
                    change="+12.5%"
                    trend="up"
                    icon={<MoneyIcon />}
                />
                <StatCard
                    title="Órdenes Activas"
                    value="23"
                    change="+3"
                    trend="up"
                    icon={<OrderIcon />}
                />
                <StatCard
                    title="Productos Bajos"
                    value="8"
                    change="-2"
                    trend="down"
                    icon={<BoxIcon />}
                />
                <StatCard
                    title="Mesas Ocupadas"
                    value="12/20"
                    change="60%"
                    trend="neutral"
                    icon={<TableIcon />}
                />
            </div>

            {/* Contenido Principal */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Órdenes Recientes */}
                <div className="lg:col-span-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Órdenes Recientes
                        </h3>
                        <div className="space-y-3">
                            <OrderRow
                                order="#1248"
                                table="Mesa 5"
                                time="Hace 5 min"
                                total="S/ 85.50"
                                status="pending"
                            />
                            <OrderRow
                                order="#1247"
                                table="Mesa 12"
                                time="Hace 12 min"
                                total="S/ 142.00"
                                status="preparing"
                            />
                            <OrderRow
                                order="#1246"
                                table="Mesa 3"
                                time="Hace 18 min"
                                total="S/ 67.80"
                                status="ready"
                            />
                        </div>
                    </div>
                </div>

                {/* Productos Más Vendidos */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                        Top Productos
                    </h3>
                    <div className="space-y-4">
                        <ProductRow name="Lomo Saltado" sold={24} />
                        <ProductRow name="Ceviche Mixto" sold={18} />
                        <ProductRow name="Aji de Gallina" sold={15} />
                        <ProductRow name="Arroz Chaufa" sold={12} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// ==================== COMPONENTES ====================

function StatCard({ title, value, change, trend, icon }) {
    const trendColors = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-600',
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                    <p className={`mt-1 text-sm ${trendColors[trend]}`}>
                        {change} vs ayer
                    </p>
                </div>
                <div className="rounded-lg bg-primary-50 p-3 text-primary-600">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function OrderRow({ order, table, time, total, status }) {
    const statusConfig = {
        pending: { label: 'Pendiente', color: 'bg-primary-100 text-primary-700' },
        preparing: { label: 'Preparando', color: 'bg-blue-100 text-blue-700' },
        ready: { label: 'Listo', color: 'bg-green-100 text-green-700' },
    };

    const config = statusConfig[status];

    return (
        <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <p className="font-medium text-gray-900">{order}</p>
                    <p className="text-sm text-gray-500">{table} • {time}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-gray-900">{total}</p>
                <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
                    {config.label}
                </span>
            </div>
        </div>
    );
}

function ProductRow({ name, sold }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200" />
                <span className="font-medium text-gray-700">{name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{sold} vendidos</span>
        </div>
    );
}

// ==================== ICONOS ====================

function MoneyIcon() {
    return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function OrderIcon() {
    return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    );
}

function BoxIcon() {
    return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    );
}

function TableIcon() {
    return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );
}