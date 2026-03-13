import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Filter, Home, Search, Target, XCircle } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

interface Indicator {
    id: number;
    codigo: string;
    nombre: string;
    objetivo: string;
    estandar: string;
    criterio: string;
    valor_ref: string | number | null;
    valor_real: string | number | null;
    cumple: boolean | null;
    avance: number;
    total_items: number;
    completados: number;
}

interface ProgramaSede {
    id: number;
    programa: { nombre: string };
    sede: { nombre: string };
}

interface Props {
    facultad: { id: number; nombre: string };
    programaSedes: ProgramaSede[];
    selectedProgramaSede: string | null;
    indicadores: Indicator[];
}

export default function IndicadoresSummary({ facultad, programaSedes, selectedProgramaSede, indicadores }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (value: string) => {
        router.get('/decanato/indicadores',
            { programa_sede: value === 'all' ? undefined : value },
            { preserveState: true }
        );
    };

    const filteredIndicators = useMemo(() => {
        return indicadores.filter(ind =>
            ind.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ind.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ind.estandar.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ind.criterio.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [indicadores, searchTerm]);

    return (
        <AppLayout>
            <Head title="Resumen de Indicadores - Decanato" />

            <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

                {/* Unified Premium Header */}
                <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/decanato" className="flex items-center gap-1 hover:text-indigo-600 transition-colors text-xs font-medium">
                                            <Home className="h-3 w-3" /> Dashboard
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="font-bold text-slate-900 text-xs text-indigo-600">Resumen de Indicadores</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>

                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                                    <Target className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                        Resumen General de Indicadores
                                    </h1>
                                    <p className="text-slate-500 text-sm font-medium">
                                        Listado consolidado de cumplimiento por indicadores en la Facultad de {facultad.nombre}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 self-end md:self-center">
                            <div className="flex items-center gap-3 bg-white p-1 rounded-xl border shadow-sm h-11">
                                <div className="flex items-center gap-2 px-3 text-slate-400 border-r pr-4 hidden lg:flex">
                                    <Search className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Buscar</span>
                                </div>
                                <div className="relative w-full sm:w-[200px]">
                                    <Input
                                        placeholder="Nombre o código..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full border-none focus-visible:ring-0 shadow-none bg-slate-50 h-9 rounded-lg text-xs font-bold text-slate-700 pr-8"
                                    />
                                    {!searchTerm && <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 pointer-events-none lg:hidden" />}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-1 rounded-xl border shadow-sm h-11">
                                <div className="flex items-center gap-2 px-3 text-slate-400 border-r pr-4 hidden lg:flex">
                                    <Filter className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Filtros</span>
                                </div>
                                <Select value={selectedProgramaSede || 'all'} onValueChange={handleFilterChange}>
                                    <SelectTrigger className="w-full sm:w-[240px] border-none focus:ring-0 shadow-none bg-slate-50 h-9 rounded-lg text-xs font-bold text-slate-700">
                                        <SelectValue placeholder="Consolidado de Facultad" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                        <SelectItem value="all" className="text-xs font-bold">Consolidado de Facultad</SelectItem>
                                        {programaSedes.map((ps) => (
                                            <SelectItem key={ps.id} value={ps.id.toString()} className="text-xs">
                                                {ps.programa.nombre} ({ps.sede.nombre})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicators List */}
                <div className="grid gap-6">
                    {filteredIndicators.length > 0 ? (
                        filteredIndicators.map((indicador) => (
                            <Card key={indicador.id} className="group overflow-hidden border-slate-100/80 hover:border-indigo-200 hover:shadow-xl transition-all duration-500 rounded-3xl bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-0">
                                    <div className="flex flex-col">
                                        {/* Header Info Area */}
                                        <div className="p-6 lg:p-8 space-y-4 border-b border-slate-50">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="h-7 px-3 bg-indigo-600 text-white border-none font-black text-[10px] tracking-wider rounded-lg shadow-sm shadow-indigo-200 uppercase">
                                                        {indicador.codigo}
                                                    </Badge>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                                        {indicador.estandar} <span className="mx-2 text-slate-200">/</span> {indicador.criterio}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${indicador.cumple === true ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : (indicador.cumple === false ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-400 border border-slate-100')}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${indicador.cumple === true ? 'bg-emerald-500 animate-pulse' : (indicador.cumple === false ? 'bg-rose-500' : 'bg-slate-300')}`} />
                                                    {indicador.cumple === true ? 'Cumple Meta' : (indicador.cumple === false ? 'Bajo la Meta' : 'Sin Datos')}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                                    {indicador.nombre}
                                                </h3>
                                                <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-4xl italic">
                                                    "{indicador.objetivo}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Metrics Bottom Area */}
                                        <div className="bg-slate-50/50 p-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                            {/* Meta */}
                                            <div className="flex flex-col gap-1 text-center md:text-left">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Meta Referencial</span>
                                                <span className="text-lg font-black text-slate-700">
                                                    {indicador.valor_ref ?? '—'}
                                                    {['ID25', 'ID26'].includes(indicador.codigo) && indicador.valor_ref !== null ? ' años' : ''}
                                                </span>
                                            </div>

                                            {/* Real */}
                                            <div className="flex flex-col gap-1 text-center md:text-left">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Valor Alcanzado</span>
                                                <div className="flex items-center justify-center md:justify-start gap-2">
                                                    {indicador.cumple === true && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                                    {indicador.cumple === false && <XCircle className="h-4 w-4 text-rose-500" />}
                                                    <span className={`text-lg font-black ${indicador.cumple === true ? 'text-emerald-600' : (indicador.cumple === false ? 'text-rose-600' : 'text-slate-600')}`}>
                                                        {indicador.valor_real ?? 'N/A'}
                                                        {['ID25', 'ID26'].includes(indicador.codigo) && indicador.valor_real !== null ? ' años' : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Progress Bar Container */}
                                            <div className="md:col-span-2 space-y-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Avance de Evidencias</span>
                                                        <span className="text-[10px] text-slate-400 font-bold">{indicador.completados} de {indicador.total_items} completados</span>
                                                    </div>
                                                    <span className="text-xl font-black text-indigo-600 italic">{indicador.avance}%</span>
                                                </div>
                                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-100 inset-shadow-sm">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                                                        style={{ width: `${indicador.avance}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 bg-slate-50 rounded-full">
                                <Search className="h-10 w-10 text-slate-300" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">No se encontraron indicadores</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                    Prueba ajustando los filtros o el término de búsqueda para encontrar lo que necesitas.
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => { setSearchTerm(''); handleFilterChange('all'); }} className="rounded-xl border-slate-200">
                                Limpiar Filtros
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
