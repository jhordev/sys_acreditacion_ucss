import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    ChevronRight,
    ClipboardCheck,
    Filter,
    Info,
    Layers,
    LayoutDashboard,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Sede = { id: number; nombre: string };
type Programa = { id: number; nombre: string };
type ProgramaSede = {
    id: number;
    programa: Programa | null;
    sede: Sede | null;
};

type HijoData = {
    id: number;
    codigo: string;
    nombre: string;
    avance: number;
    total_items: number;
    completados: number;
    tipo: 'evidencia' | 'indicador';
    info?: string;
    objetivo?: string;
    tipo_dato?: string;
    valor_ref?: string;
    valor_real?: string | number | null;
    cumple?: boolean | null;
    items: {
        id: number;
        nombre: string;
        tipo: string;
        estado: string;
    }[];
};

type CriterioData = {
    id: number;
    nombre: string;
    descripcion: string;
    avance: number;
    hijos: HijoData[];
};

type EstandarData = {
    id: number;
    nombre: string;
    titulo: string;
    descripcion: string;
    avance: number;
    criterios: CriterioData[];
};

type Props = {
    facultad: { id: number; nombre: string };
    programaSedes: ProgramaSede[];
    selectedProgramaSede: string | null;
    avanceData: EstandarData[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Decanato', href: '/decanato' },
];

function getProgressColor(progress: number) {
    if (progress >= 100) return 'bg-emerald-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
}

function getProgressBg(progress: number) {
    if (progress >= 100) return 'bg-emerald-50/50 border-emerald-100';
    if (progress >= 75) return 'bg-blue-50/50 border-blue-100';
    if (progress >= 50) return 'bg-amber-50/50 border-amber-100';
    return 'bg-rose-50/50 border-rose-100';
}

export default function DecanatoDashboard({
    facultad,
    programaSedes,
    selectedProgramaSede,
    avanceData,
}: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) return avanceData;
        const term = searchTerm.toLowerCase();
        return avanceData.map(estandar => ({
            ...estandar,
            criterios: estandar.criterios.filter(criterio =>
                criterio.nombre.toLowerCase().includes(term) ||
                criterio.descripcion?.toLowerCase().includes(term) ||
                criterio.hijos.some(h => h.nombre.toLowerCase().includes(term) || h.codigo.toLowerCase().includes(term))
            )
        })).filter(estandar =>
            estandar.nombre.toLowerCase().includes(term) ||
            estandar.titulo.toLowerCase().includes(term) ||
            estandar.criterios.length > 0
        );
    }, [avanceData, searchTerm]);

    const stats = useMemo(() => {
        const totalEstandares = avanceData.length;
        const avgAvance = avanceData.length > 0
            ? avanceData.reduce((acc, curr) => acc + curr.avance, 0) / totalEstandares
            : 0;

        let totalItems = 0;
        let complItems = 0;

        avanceData.forEach(e => {
            e.criterios.forEach(c => {
                c.hijos.forEach(h => {
                    totalItems += h.total_items;
                    complItems += h.completados;
                });
            });
        });

        return {
            avgAvance: Math.round(avgAvance),
            totalItems,
            complItems,
            totalEstandares
        };
    }, [avanceData]);

    function onProgramaSedeChange(value: string) {
        const params = value === 'all' ? {} : { programa_sede: value };
        router.get('/decanato', params, { preserveState: false });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Decanato - ${facultad.nombre}`} />
            <div className="flex flex-col gap-6 p-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Heading
                            title={`Facultad de ${facultad.nombre}`}
                            description="Seguimiento consolidado del avance de acreditación por programa y sede."
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-2 rounded-xl border shadow-sm">
                        <div className="flex items-center gap-2 px-2 text-muted-foreground border-r pr-4 mr-2 hidden lg:flex">
                            <Filter className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Filtros</span>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Label className="text-xs font-medium whitespace-nowrap sr-only">Programa - Sede:</Label>
                            <Select value={selectedProgramaSede ?? 'all'} onValueChange={onProgramaSedeChange}>
                                <SelectTrigger className="w-full sm:w-[320px] h-9 border-none focus:ring-0 shadow-none bg-secondary/50">
                                    <SelectValue placeholder="Todos los Programas / Sedes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Consolidado de Facultad</SelectItem>
                                    {programaSedes.map((ps) => (
                                        <SelectItem key={ps.id} value={ps.id.toString()}>
                                            {ps.programa?.nombre} — {ps.sede?.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Avance General"
                        value={`${stats.avgAvance}%`}
                        icon={<BarChart3 className="h-5 w-5 text-indigo-600" />}
                        description="Promedio consolidado"
                        footer={<Progress value={stats.avgAvance} className="h-1.5 mt-2" />}
                    />
                    <StatCard
                        title="Tareas Totales"
                        value={stats.totalItems}
                        icon={<Layers className="h-5 w-5 text-blue-600" />}
                        description="Items de verificación"
                    />
                    <StatCard
                        title="Completadas"
                        value={stats.complItems}
                        icon={<ClipboardCheck className="h-5 w-5 text-emerald-600" />}
                        description={`${stats.totalItems > 0 ? Math.round((stats.complItems / stats.totalItems) * 100) : 0}% completado`}
                    />
                    <StatCard
                        title="Estándares"
                        value={stats.totalEstandares}
                        icon={<LayoutDashboard className="h-5 w-5 text-amber-600" />}
                        description="Nivel superior"
                    />
                </div>

                {/* Tree View Section */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar estándar, criterio o indicador..."
                        className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid gap-6">
                    {filteredData.length === 0 ? (
                        <Card className="border-dashed flex flex-col items-center justify-center p-12 text-muted-foreground">
                            <Search className="h-12 w-12 mb-4 opacity-20" />
                            <p>No se encontraron resultados para tu búsqueda.</p>
                        </Card>
                    ) : (
                        filteredData.map((estandar) => (
                            <EstandarCard key={estandar.id} estandar={estandar} />
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, description, footer }: any) {
    return (
        <Card className="overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
                {footer}
            </CardContent>
        </Card>
    );
}

function EstandarCard({ estandar }: { estandar: EstandarData }) {
    return (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden border-l-4 border-l-indigo-600">
            <div className="p-5 border-b bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 uppercase text-[10px] tracking-widest font-bold">
                            Estándar {estandar.id}
                        </Badge>
                        <span className="text-sm font-semibold text-indigo-900">{estandar.nombre}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{estandar.titulo}</h3>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border shadow-sm min-w-[200px]">
                    <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-tighter text-slate-500">
                            <span>Avance Consolidado</span>
                            <span className="text-indigo-600">{estandar.avance}%</span>
                        </div>
                        <Progress value={estandar.avance} className="h-2" indicatorClassName={getProgressColor(estandar.avance)} />
                    </div>
                </div>
            </div>

            <div className="p-2 space-y-2">
                {estandar.criterios.map((criterio) => (
                    <CriterioAccordion key={criterio.id} criterio={criterio} />
                ))}
            </div>
        </div>
    );
}

function CriterioAccordion({ criterio }: { criterio: CriterioData }) {
    return (
        <Collapsible className="group/coll">
            <CollapsibleTrigger className="flex w-full items-center gap-4 p-4 text-left hover:bg-slate-50 rounded-xl transition-colors">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-data-[state=open]/coll:bg-indigo-100 group-data-[state=open]/coll:text-indigo-600 transition-colors">
                    <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/coll:rotate-90" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-slate-800 text-sm">{criterio.nombre}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{criterio.descripcion}</p>
                </div>

                <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Subnivel</div>
                        <div className="text-xs font-semibold text-slate-600">{criterio.avance}%</div>
                    </div>
                    <div className="w-24 shrink-0">
                        <Progress value={criterio.avance} className="h-1.5" indicatorClassName={getProgressColor(criterio.avance)} />
                    </div>
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
                <div className="px-14 pb-6 pt-2">
                    {(() => {
                        const evidencias = criterio.hijos.filter(h => h.tipo === 'evidencia');
                        const indicadores = criterio.hijos.filter(h => h.tipo === 'indicador');
                        const hasBoth = evidencias.length > 0 && indicadores.length > 0;

                        const renderList = (list: HijoData[]) => (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4">
                                {list.map((hijo) => (
                                    <HijoCard key={`${hijo.tipo}-${hijo.id}`} hijo={hijo} />
                                ))}
                            </div>
                        );

                        if (criterio.hijos.length === 0) {
                            return <p className="text-xs text-muted-foreground italic py-4">No hay evidencias o indicadores asociados.</p>;
                        }

                        if (!hasBoth) {
                            return renderList(criterio.hijos);
                        }

                        return (
                            <Tabs defaultValue="evidencias" className="w-full">
                                <TabsList className="bg-slate-100/80 p-1 h-10 border shadow-sm">
                                    <TabsTrigger value="evidencias" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                                        <div className="flex items-center gap-2">
                                            <ClipboardCheck className="h-3.5 w-3.5" />
                                            <span>Evidencias</span>
                                            <Badge variant="secondary" className="h-4 min-w-[18px] px-1 text-[10px]">{evidencias.length}</Badge>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="indicadores" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 className="h-3.5 w-3.5" />
                                            <span>Indicadores</span>
                                            <Badge variant="secondary" className="h-4 min-w-[18px] px-1 text-[10px]">{indicadores.length}</Badge>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="evidencias" className="mt-0">
                                    {renderList(evidencias)}
                                </TabsContent>
                                <TabsContent value="indicadores" className="mt-0">
                                    {renderList(indicadores)}
                                </TabsContent>
                            </Tabs>
                        );
                    })()}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

function HijoCard({ hijo }: { hijo: HijoData }) {
    const itemsCompletos = hijo.items.filter(i => i.estado.toLowerCase() === 'completo');
    const itemsPendientes = hijo.items.filter(i => i.estado.toLowerCase() !== 'completo');

    return (
        <div className={`flex flex-col p-4 rounded-xl border group hover:shadow-md transition-all ${getProgressBg(hijo.avance)}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 flex gap-3 min-w-0">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="h-9 w-9 rounded-full bg-white border flex items-center justify-center shrink-0 shadow-sm cursor-help hover:scale-110 transition-transform">
                                    {hijo.tipo === 'indicador' ?
                                        <BarChart3 className="h-4 w-4 text-indigo-500" /> :
                                        <ClipboardCheck className="h-4 w-4 text-emerald-500" />
                                    }
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-[300px]">
                                <div className="p-1">
                                    <p className="font-bold text-xs uppercase tracking-widest mb-1 text-muted-foreground">{hijo.tipo}</p>
                                    <p className="text-sm leading-relaxed">{hijo.tipo === 'indicador' ? hijo.info : 'Evidencia documental'}</p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <Badge variant="outline" className="bg-white border-none shadow-none text-[9px] font-mono font-bold leading-none p-0 text-slate-500">
                                {hijo.codigo}
                            </Badge>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight line-clamp-2 mb-1" title={hijo.nombre}>
                            {hijo.nombre}
                        </p>

                        {hijo.tipo === 'indicador' && (
                            <div className="space-y-2 mt-2 pt-2 border-t border-slate-200/50">
                                {hijo.objetivo && (
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-tight">Objetivo</span>
                                        <p className="text-[11px] text-slate-600 italic line-clamp-2 leading-tight">"{hijo.objetivo}"</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-2">
                                    {hijo.tipo_dato && (
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-tight">Tipo Dato</span>
                                            <Badge variant="secondary" className="text-[9px] h-4 px-1.5 font-bold uppercase">{hijo.tipo_dato}</Badge>
                                        </div>
                                    )}
                                    {hijo.valor_ref && (
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-tight">Valor Ref.</span>
                                            <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-bold border-indigo-200 text-indigo-700 bg-indigo-50/50">{hijo.valor_ref}</Badge>
                                        </div>
                                    )}
                                </div>

                                {(hijo.valor_real !== undefined && hijo.valor_real !== null) && (
                                    <div className="mt-3 p-2 rounded-lg bg-white/50 border border-slate-200/50 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-tight mb-1">Resultado Alcanzado</span>
                                            <span className="text-sm font-black text-slate-700">{hijo.valor_real}%</span>
                                        </div>
                                        {hijo.cumple !== null && (
                                            <Badge
                                                className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 shadow-sm border-none ${hijo.cumple
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-rose-500 text-white'
                                                    }`}
                                            >
                                                {hijo.cumple ? 'Cumple' : 'No Cumple'}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-800 tracking-tighter">{hijo.avance}%</span>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Completado</p>
                </div>
            </div>

            <div className="mt-auto pt-2 space-y-2">
                <Progress value={hijo.avance} className="h-1.5 bg-white/50" indicatorClassName={getProgressColor(hijo.avance)} />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1">
                            {[...Array(Math.min(3, hijo.total_items))].map((_, i) => (
                                <div key={i} className={`h-2 w-2 rounded-full border border-white ${i < hijo.completados ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                            ))}
                            {hijo.total_items > 3 && (
                                <span className="text-[8px] font-bold text-slate-400 pl-1.5">+{hijo.total_items - 3}</span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">
                            {hijo.completados} de {hijo.total_items} evidencias
                        </span>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest flex items-center gap-1">
                                Ver Evidencias <Info className="h-3 w-3" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {hijo.tipo === 'indicador' ? <BarChart3 className="h-5 w-5 text-indigo-500" /> : <ClipboardCheck className="h-5 w-5 text-emerald-500" />}
                                    <span>{hijo.codigo}: {hijo.nombre}</span>
                                </DialogTitle>
                                <DialogDescription>
                                    Listado detallado de evidencias y cumplimiento.
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="all" className="mt-4 flex-1 overflow-hidden flex flex-col">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="all">Todos ({hijo.items.length})</TabsTrigger>
                                    <TabsTrigger value="pending">Pendientes ({itemsPendientes.length})</TabsTrigger>
                                    <TabsTrigger value="completed">Completados ({itemsCompletos.length})</TabsTrigger>
                                </TabsList>

                                <div className="mt-4 overflow-y-auto pr-2 space-y-2 flex-1">
                                    <TabsContent value="all" className="mt-0 space-y-2">
                                        <ItemsList items={hijo.items} />
                                    </TabsContent>
                                    <TabsContent value="pending" className="mt-0 space-y-2">
                                        <ItemsList items={itemsPendientes} />
                                    </TabsContent>
                                    <TabsContent value="completed" className="mt-0 space-y-2">
                                        <ItemsList items={itemsCompletos} />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

function ItemsList({ items }: { items: any[] }) {
    if (items.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed text-sm">
                No hay evidencias en esta categoría.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border rounded-lg shadow-sm hover:border-indigo-200 transition-colors">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 leading-snug">{item.nombre}</p>
                        <Badge variant="outline" className="mt-1 text-[10px] uppercase tracking-tighter py-0 h-4">{item.tipo}</Badge>
                    </div>
                    <div>
                        <Badge className={`text-[10px] uppercase font-bold ${item.estado.toLowerCase() === 'completo' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            item.estado.toLowerCase() === 'revisión' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                'bg-amber-100 text-amber-700 border-amber-200'
                            }`} variant="outline">
                            {item.estado}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Label({ children, className, ...props }: any) {
    return (
        <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
            {children}
        </label>
    );
}
