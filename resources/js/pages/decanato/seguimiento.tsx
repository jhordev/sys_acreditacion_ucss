import { Head, router } from '@inertiajs/react';
import { Award, ChevronLeft, ChevronRight, ClipboardList, FileCheck, Filter, Home, Search, Target } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

interface Item {
    id: number;
    nombre: string;
    tipo: string;
    estado: string;
}

interface Hijo {
    id: number;
    codigo: string;
    nombre: string;
    objetivo?: string;
    tipo_dato?: string;
    valor_ref?: number;
    valor_real?: number;
    cumple?: boolean | null;
    avance: number;
    total_items: number;
    completados: number;
    tipo: 'indicador' | 'evidencia';
    items: Item[];
}

interface Criterio {
    id: number;
    nombre: string;
    descripcion: string;
    avance: number;
    hijos: Hijo[];
}

interface Estandar {
    id: number;
    nombre: string;
    titulo: string;
    descripcion: string;
    avance: number;
    criterios: Criterio[];
}

interface Props {
    facultad: { id: number; nombre: string };
    programaSedes: { id: number; programa: { nombre: string }; sede: { nombre: string } }[];
    selectedProgramaSede: string;
    avanceData: Estandar[];
}

export default function Seguimiento({ facultad, programaSedes, selectedProgramaSede, avanceData }: Props) {
    const [viewLevel, setViewLevel] = useState<'estandares' | 'criterios' | 'detalles'>('estandares');
    const [selectedEstandar, setSelectedEstandar] = useState<Estandar | null>(null);
    const [selectedCriterio, setSelectedCriterio] = useState<Criterio | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (value: string) => {
        router.get('/decanato/seguimiento',
            { programa_sede: value === 'all' ? undefined : value },
            { preserveState: true }
        );
    };

    const navigateToCriteria = (estandar: Estandar) => {
        setSelectedEstandar(estandar);
        setViewLevel('criterios');
        window.scrollTo(0, 0);
    };

    const navigateToDetails = (criterio: Criterio) => {
        setSelectedCriterio(criterio);
        setViewLevel('detalles');
        window.scrollTo(0, 0);
    };

    const goBackToStandards = () => {
        setSelectedEstandar(null);
        setSelectedCriterio(null);
        setViewLevel('estandares');
    };

    const goBackToCriteria = () => {
        setSelectedCriterio(null);
        setViewLevel('criterios');
    };

    // Filter logic
    const filteredStandards = avanceData.filter(e =>
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCriteria = selectedEstandar?.criterios.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <AppLayout>
            <Head title="Seguimiento Detallado - Decanato" />

            <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">

                {/* Unified Premium Header */}
                <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink
                                            onClick={goBackToStandards}
                                            className="cursor-pointer flex items-center gap-1 hover:text-indigo-600 transition-colors text-xs font-medium"
                                        >
                                            <Home className="h-3 w-3" /> Estándares
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {selectedEstandar && (
                                        <>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbLink
                                                    onClick={goBackToCriteria}
                                                    className="cursor-pointer max-w-[150px] truncate hover:text-indigo-600 transition-colors text-xs font-medium"
                                                >
                                                    {selectedEstandar.nombre}
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                        </>
                                    )}
                                    {selectedCriterio && (
                                        <>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage className="font-bold text-slate-900 max-w-[150px] truncate text-xs">{selectedCriterio.nombre}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </>
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>

                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                                    {viewLevel === 'estandares' && <Award className="h-6 w-6 text-indigo-600" />}
                                    {viewLevel === 'criterios' && <ClipboardList className="h-6 w-6 text-indigo-600" />}
                                    {viewLevel === 'detalles' && <FileCheck className="h-6 w-6 text-indigo-600" />}
                                </div>
                                <div className="space-y-0.5">
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                        {viewLevel === 'estandares' && 'Seguimiento por Estándares'}
                                        {viewLevel === 'criterios' && selectedEstandar?.nombre}
                                        {viewLevel === 'detalles' && selectedCriterio?.nombre}
                                    </h1>
                                    <p className="text-slate-500 text-sm font-medium">
                                        {viewLevel === 'estandares' && `Monitoreo general de la Facultad de ${facultad.nombre}`}
                                        {viewLevel === 'criterios' && selectedEstandar?.titulo}
                                        {viewLevel === 'detalles' && selectedCriterio?.descripcion}
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

                            <div className="flex items-center gap-3 bg-white p-1 rounded-xl border shadow-sm">
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

                {/* VIEW LEVEL: ESTANDARES */}
                {viewLevel === 'estandares' && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in slide-in-from-bottom-4 duration-500">
                        {filteredStandards.map((estandar) => (
                            <Card
                                key={estandar.id}
                                className="group cursor-pointer border-none ring-1 ring-slate-100 shadow-sm hover:shadow-xl hover:ring-indigo-200 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
                                onClick={() => navigateToCriteria(estandar)}
                            >
                                <div className="h-2 bg-slate-100 group-hover:bg-indigo-500 transition-colors" />
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold uppercase tracking-widest text-[10px]">
                                            {estandar.nombre}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            <span className="text-[10px] font-black text-slate-800">{Math.round(estandar.avance)}%</span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {estandar.titulo}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-4">
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50 shadow-inner mb-2 mt-1">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                                            style={{ width: `${estandar.avance}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                        {estandar.descripcion}
                                    </p>
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{estandar.criterios.length} Criterios</span>
                                        <Button variant="ghost" size="sm" className="h-8 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-lg">
                                            Ver Criterios <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* VIEW LEVEL: CRITERIOS */}
                {viewLevel === 'criterios' && selectedEstandar && (
                    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
                        <Button variant="link" onClick={goBackToStandards} className="w-fit p-0 h-auto text-slate-400 hover:text-indigo-600 group font-bold">
                            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Volver a Estándares
                        </Button>

                        <div className="grid gap-6 md:grid-cols-2">
                            {filteredCriteria.map((criterio) => (
                                <Card
                                    key={criterio.id}
                                    className="group cursor-pointer border-none ring-1 ring-slate-100 shadow-sm hover:shadow-lg hover:ring-indigo-100 transition-all rounded-2xl overflow-hidden"
                                    onClick={() => navigateToDetails(criterio)}
                                >
                                    <div className="flex h-full">
                                        <div className="w-1.5 bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                                        <div className="flex-1 p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="space-y-1">
                                                    <h3 className="font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-tight">{criterio.nombre}</h3>
                                                    <p className="text-xs text-slate-500 line-clamp-2">{criterio.descripcion}</p>
                                                </div>
                                                <div className="pl-4 text-right">
                                                    <span className="text-xl font-black text-slate-900">{Math.round(criterio.avance)}%</span>
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase">Avance</div>
                                                </div>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 ring-1 ring-slate-200/50 shadow-inner">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                                                    style={{ width: `${criterio.avance}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Target className="h-3 w-3 text-emerald-500" />
                                                        <span className="text-[10px] font-bold text-slate-500">{criterio.hijos.filter(h => h.tipo === 'indicador').length} INDICADORES</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <FileCheck className="h-3 w-3 text-amber-500" />
                                                        <span className="text-[10px] font-bold text-slate-500">{criterio.hijos.filter(h => h.tipo === 'evidencia').length} EVIDENCIAS</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* VIEW LEVEL: DETALLES (TABBED) */}
                {viewLevel === 'detalles' && selectedCriterio && (
                    <div className="flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500">
                        <Button variant="link" onClick={goBackToCriteria} className="w-fit p-0 h-auto text-slate-400 hover:text-indigo-600 group font-bold">
                            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Volver a Criterios
                        </Button>

                        <Tabs defaultValue={selectedCriterio.hijos.some(h => h.tipo === 'evidencia') ? 'evidencias' : 'indicadores'} className="w-full">
                            <div className="flex items-center justify-between border-b border-slate-100 mb-8 pb-4">
                                <TabsList className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                    {selectedCriterio.hijos.some(h => h.tipo === 'evidencia') && (
                                        <TabsTrigger value="evidencias" className="rounded-lg px-6 font-black uppercase text-[11px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                                            Evidencias
                                        </TabsTrigger>
                                    )}
                                    {selectedCriterio.hijos.some(h => h.tipo === 'indicador') && (
                                        <TabsTrigger value="indicadores" className="rounded-lg px-6 font-black uppercase text-[11px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                                            Indicadores
                                        </TabsTrigger>
                                    )}
                                </TabsList>
                                <div className="text-xs font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 uppercase tracking-widest">
                                    {Math.round(selectedCriterio.avance)}% TOTAL CRITERIO
                                </div>
                            </div>

                            <TabsContent value="evidencias" className="mt-0 focus-visible:outline-none">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {selectedCriterio.hijos.filter(h => h.tipo === 'evidencia').map((hijo) => (
                                        <DetalleCard key={hijo.id} hijo={hijo} />
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="indicadores" className="mt-0 focus-visible:outline-none">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {selectedCriterio.hijos.filter(h => h.tipo === 'indicador').map((hijo) => (
                                        <DetalleCard key={hijo.id} hijo={hijo} />
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}

// Sub-component for Details Cards
function DetalleCard({ hijo }: { hijo: Hijo }) {
    return (
        <Card className="border-none ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-50">
                <div className="flex items-center justify-between mb-3">
                    <Badge className={`font-black uppercase text-[9px] px-2 py-0.5 tracking-widest ${hijo.tipo === 'indicador' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>
                        {hijo.codigo}
                    </Badge>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">{Math.round(hijo.avance)}%</span>
                        <div className="h-6 w-[2px] bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400 uppercase">{hijo.completados}/{hijo.total_items} ITEMS</span>
                    </div>
                </div>
                <CardTitle className="text-sm font-black text-slate-800 leading-relaxed uppercase tracking-tight">
                    {hijo.nombre}
                </CardTitle>
                {hijo.objetivo && (
                    <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-2">
                        Objetivo: <span className="text-slate-400 normal-case font-medium">{hijo.objetivo}</span>
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-6">
                {hijo.tipo === 'indicador' && hijo.valor_ref !== null && (
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-inner">
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Referencial</span>
                            <span className="text-lg font-black text-slate-700">{hijo.valor_ref}%</span>
                        </div>
                        <div className={`flex-1 p-3 rounded-xl border shadow-inner ${hijo.cumple ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                            <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${hijo.cumple ? 'text-emerald-500' : 'text-rose-500'}`}>Alcanzado</span>
                            <div className="flex items-center justify-between">
                                <span className={`text-lg font-black ${hijo.cumple ? 'text-emerald-700' : 'text-rose-700'}`}>{hijo.valor_real ?? '--'}%</span>
                                {hijo.valor_real !== null && (
                                    <Badge className={`${hijo.cumple ? 'bg-emerald-500' : 'bg-rose-500'} text-white border-none text-[8px] font-black`}>
                                        {hijo.cumple ? 'CUMPLE' : 'NO CUMPLE'}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Desglose de Ítems</h4>
                    <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {hijo.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors group">
                                <div className="space-y-0.5">
                                    <span className="block text-xs font-bold text-slate-700">{item.nombre}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.tipo}</span>
                                </div>
                                <Badge variant="outline" className={`text-[9px] font-black border-none uppercase ${item.estado.toLowerCase() === 'completo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {item.estado}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
