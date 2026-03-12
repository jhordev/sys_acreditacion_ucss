import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Circle, LayoutDashboard, Target, Users } from 'lucide-react';
import {
    Cell, Pie, PieChart,
    ResponsiveContainer, Tooltip
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface ProgramaSede {
    id: number;
    programa: { id: number; nombre: string };
    sede: { id: number; nombre: string };
}

interface Analytics {
    // Decanato
    avancePorPrograma?: { name: string; avance: number }[];
    cumplimientoStats?: { name: string; value: number; fill: string }[];
    avanceGeneral?: number;
    totalCompletados?: number;

    // Admin
    userRoleStats?: { name: string; value: number; fill: string }[];
    estadoStats?: { name: string; value: number; fill: string }[];
    totalUsers?: number;
    totalFacultades?: number;
    totalProgramas?: number;
    totalSedes?: number;

    // Common
    totalItems: number;
}

interface Props {
    isDecanato?: boolean;
    isAdmin?: boolean;
    facultad?: { id: number; nombre: string };
    programaSedes?: ProgramaSede[];
    selectedProgramaSede?: string | null;
    analytics?: Analytics;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard({ isDecanato, isAdmin, facultad, programaSedes, selectedProgramaSede, analytics }: Props) {
    const handleFilterChange = (id: string) => {
        router.get(dashboard(), { programa_sede: id === 'all' ? '' : id }, { preserveState: true });
    };

    if ((!isDecanato && !isAdmin) || !analytics) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="bg-white rounded-xl border p-8 text-center space-y-4">
                        <LayoutDashboard className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <h2 className="text-xl font-semibold">Bienvenido al Sistema de Acreditación</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Utilice el menú lateral para navegar por las diferentes secciones del sistema.
                        </p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (isAdmin) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard Administrativo" />
                <div className="flex flex-col gap-6 p-6">
                    {/* Header Admin */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                                <LayoutDashboard className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Panel de Control: Administrador</h1>
                                <p className="text-muted-foreground text-sm">Vista global del estado del sistema y gestión de usuarios.</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Admin */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-white shadow-sm border-none ring-1 ring-slate-100 overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Usuarios Totales</CardTitle>
                                <Users className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900">{analytics.totalUsers}</div>
                                <p className="text-xs text-slate-400 mt-1">Registrados en el sistema</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-sm border-none ring-1 ring-slate-100 overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Unidades Académicas</CardTitle>
                                <Target className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900">{analytics.totalFacultades}</div>
                                <p className="text-xs text-slate-400 mt-1">Facultades activas</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-sm border-none ring-1 ring-slate-100 overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Oferta Académica</CardTitle>
                                <Circle className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900">{analytics.totalProgramas}</div>
                                <p className="text-xs text-slate-400 mt-1">Programas registrados</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-sm border-none ring-1 ring-slate-100 overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Sedes</CardTitle>
                                <LayoutDashboard className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900">{analytics.totalSedes}</div>
                                <p className="text-xs text-slate-400 mt-1">Sedes a nivel nacional</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Admin */}
                    <div className="grid gap-6 lg:grid-cols-12">
                        <Card className="lg:col-span-6 bg-white border-none ring-1 ring-slate-100 shadow-sm overflow-hidden">
                            <CardHeader className="border-b border-slate-50">
                                <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Distribución de Roles</CardTitle>
                                <CardDescription className="text-xs">Usuarios distribuidos por nivel de acceso.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="h-[300px] w-full items-center justify-center flex relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={analytics.userRoleStats}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {analytics.userRoleStats?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border-none">
                                                                <p className="font-bold text-sm">{payload[0].name}: <span className="text-indigo-300">{payload[0].value}</span></p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {analytics.userRoleStats?.map((stat, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stat.fill }} />
                                                <span className="text-[10px] font-bold text-slate-600 uppercase">{stat.name}</span>
                                            </div>
                                            <span className="text-xs font-black text-slate-900">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-6 bg-white border-none ring-1 ring-slate-100 shadow-sm overflow-hidden">
                            <CardHeader className="border-b border-slate-50">
                                <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Estado de Ítems del Sistema</CardTitle>
                                <CardDescription className="text-xs">Consolidado general de avance de evidencias.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="h-[300px] w-full items-center justify-center flex relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={analytics.estadoStats}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {analytics.estadoStats?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border-none">
                                                                <p className="font-bold text-sm text-[10px] uppercase tracking-wider">{payload[0].name}</p>
                                                                <p className="font-black text-xl text-indigo-300">{payload[0].value}</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                                        <div className="text-4xl font-black text-slate-900">{analytics.totalItems}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {analytics.estadoStats?.map((stat, i) => (
                                        <div key={i} className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                                            <div className="h-1.5 w-6 rounded-full mb-1" style={{ backgroundColor: stat.fill }} />
                                            <span className="text-[8px] font-black text-slate-400 uppercase text-center truncate w-full">{stat.name}</span>
                                            <span className="text-sm font-black text-slate-900">{stat.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Académico" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard: {facultad?.nombre}</h1>
                        </div>
                        <p className="text-muted-foreground text-sm">Vista general del avance y cumplimiento académico de la facultad.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={selectedProgramaSede || 'all'} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-[300px] bg-white border-slate-200 focus:ring-indigo-500 shadow-sm">
                                <SelectValue placeholder="Todos los programas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Consolidado Facultad (Todos)</SelectItem>
                                {programaSedes?.map((ps) => (
                                    <SelectItem key={ps.id} value={ps.id.toString()}>
                                        {ps.programa.nombre} - {ps.sede.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Top Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-white shadow-sm border-none ring-1 ring-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Avance General</CardTitle>
                            <Target className="h-4 w-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">{analytics.avanceGeneral}%</div>
                            <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${analytics.avanceGeneral}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-none ring-1 ring-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Items Completados</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">{analytics.totalCompletados}</div>
                            <p className="text-xs text-slate-400 mt-1">de <span className="font-bold text-slate-600">{analytics.totalItems}</span> items totales registrados</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-none ring-1 ring-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Programas Activos</CardTitle>
                            <Users className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">{programaSedes?.length || 0}</div>
                            <p className="text-xs text-slate-400 mt-1">En sedes a nivel nacional</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm border-none ring-1 ring-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Status Acreditación</CardTitle>
                            <Circle className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={`px-3 py-1 text-xs font-bold ${analytics.avanceGeneral && analytics.avanceGeneral > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        analytics.avanceGeneral && analytics.avanceGeneral > 50 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}
                                >
                                    {analytics.avanceGeneral && analytics.avanceGeneral > 80 ? 'EXCELENTE' : analytics.avanceGeneral && analytics.avanceGeneral > 50 ? 'EN PROGRESO' : 'CRÍTICO'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts & Tables Section */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Progress Table: Success per Program */}
                    <Card className="lg:col-span-8 bg-white border-none ring-1 ring-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="border-b border-slate-50 pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Rendimiento por Programa / Sede</CardTitle>
                                <CardDescription className="text-xs">Desglose detallado del avance jerárquico consolidado.</CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold">
                                {analytics.avancePorPrograma?.length || 0} UNIDADES
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-100">
                                            <th className="text-left py-3 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Programa / Sede</th>
                                            <th className="text-left py-3 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Avance</th>
                                            <th className="text-right py-3 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Carga</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {analytics.avancePorPrograma?.map((prog, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50/80 transition-all">
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">{prog.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">Facultad de {facultad?.nombre}</div>
                                                </td>
                                                <td className="py-4 px-6 min-w-[200px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50 shadow-inner">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)] ${prog.avance > 75 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                                                                    prog.avance > 40 ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' :
                                                                        'bg-gradient-to-r from-amber-400 to-rose-500'
                                                                    }`}
                                                                style={{ width: `${prog.avance}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-black text-slate-700 w-9">{prog.avance}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Badge variant="outline" className={`text-[10px] font-bold border-none ${prog.avance === 100 ? 'bg-emerald-50 text-emerald-600' :
                                                        prog.avance > 0 ? 'bg-indigo-50 text-indigo-600' :
                                                            'bg-slate-50 text-slate-400'
                                                        }`}>
                                                        {prog.avance === 100 ? 'COMPLETADO' : prog.avance > 0 ? 'EN CURSO' : 'INICIAL'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pie Chart: Indicator Compliance */}
                    <Card className="lg:col-span-4 bg-white border-none ring-1 ring-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
                        <CardHeader className="border-b border-slate-50 pb-4">
                            <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Cumplimiento de Indicadores</CardTitle>
                            <CardDescription className="text-xs">Distribución de cumplimiento según estándares.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center pt-6">
                            <div className="h-[280px] w-full items-center justify-center flex flex-col relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.cumplimientoStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={105}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                            animationBegin={200}
                                            animationDuration={1500}
                                        >
                                            {analytics.cumplimientoStats?.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.fill}
                                                    className="outline-none hover:opacity-80 transition-opacity"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border-none animate-in fade-in zoom-in duration-200">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                                                                <p className="font-bold text-sm">{payload[0].name}: <span className="text-indigo-300">{payload[0].value}</span></p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] text-center">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tasa Media</p>
                                    <div className="text-4xl font-black text-slate-900 leading-none">
                                        {analytics.cumplimientoStats && Math.round((analytics.cumplimientoStats[0].value / (analytics.cumplimientoStats[0].value + analytics.cumplimientoStats[1].value || 1)) * 100)}<span className="text-lg opacity-40">%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full grid grid-cols-1 gap-2 mt-4 px-2">
                                {analytics.cumplimientoStats?.map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: stat.fill }} />
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{stat.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900 px-2 py-0.5 bg-white rounded-md border border-slate-100 shadow-sm">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
