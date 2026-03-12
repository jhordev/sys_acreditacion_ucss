import { Head, router, useForm } from '@inertiajs/react';
import { BarChart3, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type TipoItem = { id: number; nombre: string };
type EstadoItem = { id: number; nombre: string };
type ProgramaSedeOption = {
    id: number;
    programa: { nombre: string } | null;
    sede: { nombre: string } | null;
};
type ItemData = {
    id: number;
    nombre_item: string;
    id_tipo_item: number;
    id_estado: number;
    id_evidencia: number | null;
    id_indicador: number | null;
    tipo_item: TipoItem | null;
    estado: EstadoItem | null;
};
type Indicador = { id: number; codigo: string; nombre: string };
type IndicadorResultado = { id: number; id_indicador: number; valor_real: number | string | null };

type Props = {
    programaSedes: ProgramaSedeOption[];
    selectedProgramaSede: string | null;
    isAdmin: boolean;
    indicadores: Indicador[];
    items: ItemData[];
    resultados: IndicadorResultado[];
    tipoItems: TipoItem[];
    estadoItems: EstadoItem[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Items Indicadores', href: '/items-indicadores' },
];

function estadoBadgeClass(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n === 'completo') return 'bg-green-100 text-green-800 border-green-200';
    if (n === 'revision') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
}

export default function ItemsIndicadores({
    programaSedes,
    selectedProgramaSede,
    isAdmin,
    indicadores,
    items,
    resultados,
    tipoItems,
    estadoItems,
}: Props) {
    const currentPS = programaSedes.find((ps) => ps.id.toString() === selectedProgramaSede);

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ItemData | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const form = useForm({
        id_programa_sede: selectedProgramaSede ?? '',
        nombre_item: '',
        id_tipo_item: '',
        id_estado: '',
        id_evidencia: null as string | null,
        id_indicador: '' as string | null,
    });

    const itemsByIndicador = useMemo(() => {
        const map: Record<number, ItemData[]> = {};
        items.forEach((i) => {
            if (i.id_indicador) {
                if (!map[i.id_indicador]) map[i.id_indicador] = [];
                map[i.id_indicador].push(i);
            }
        });
        return map;
    }, [items]);

    function onProgramaSedeChange(value: string) {
        router.get('/items-indicadores', { programa_sede: value }, { preserveState: false });
    }

    function openCreate(indicadorId: number) {
        setEditing(null);
        form.setData({
            id_programa_sede: selectedProgramaSede ?? '',
            nombre_item: '',
            id_tipo_item: '',
            id_estado: '',
            id_evidencia: null,
            id_indicador: indicadorId.toString(),
        });
        setOpen(true);
    }

    function openEdit(item: ItemData) {
        setEditing(item);
        form.setData({
            id_programa_sede: selectedProgramaSede ?? '',
            nombre_item: item.nombre_item ?? '',
            id_tipo_item: item.id_tipo_item?.toString() ?? '',
            id_estado: item.id_estado?.toString() ?? '',
            id_evidencia: null,
            id_indicador: item.id_indicador?.toString() ?? null,
        });
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/items-indicadores/${editing.id}`, { onSuccess: () => setOpen(false) });
        } else {
            form.post('/items-indicadores', { onSuccess: () => setOpen(false) });
        }
    }

    function changeEstado(item: ItemData, newEstadoId: string) {
        router.put(`/items-indicadores/${item.id}`, {
            nombre_item: item.nombre_item,
            id_tipo_item: item.id_tipo_item,
            id_estado: newEstadoId,
        }, { preserveState: true, preserveScroll: true });
    }

    function destroy(id: number) {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    }

    function confirmDelete() {
        if (itemToDelete) {
            router.delete(`/items-indicadores/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Items Indicadores" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Items Indicadores" description="Definir tareas para cada indicador" />
                </div>

                {isAdmin ? (
                    <div className="flex items-center gap-3">
                        <Label className="text-sm whitespace-nowrap">Programa - Sede:</Label>
                        <Select value={selectedProgramaSede ?? ''} onValueChange={onProgramaSedeChange}>
                            <SelectTrigger className="w-96">
                                <SelectValue placeholder="Seleccionar programa - sede" />
                            </SelectTrigger>
                            <SelectContent>
                                {programaSedes.map((ps) => (
                                    <SelectItem key={ps.id} value={ps.id.toString()}>
                                        {ps.programa?.nombre} - {ps.sede?.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : currentPS ? (
                    <div className="flex items-center gap-3">
                        <Label className="text-sm whitespace-nowrap">Programa - Sede:</Label>
                        {programaSedes.length > 1 ? (
                            <Select value={selectedProgramaSede ?? ''} onValueChange={onProgramaSedeChange}>
                                <SelectTrigger className="w-96">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {programaSedes.map((ps) => (
                                        <SelectItem key={ps.id} value={ps.id.toString()}>
                                            {ps.programa?.nombre} - {ps.sede?.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <span className="text-sm font-medium">{currentPS.programa?.nombre} - {currentPS.sede?.nombre}</span>
                        )}
                    </div>
                ) : null}

                {!selectedProgramaSede && isAdmin && (
                    <div className="rounded-lg border p-8 text-center text-muted-foreground">
                        Selecciona un programa-sede para ver y gestionar los items de indicadores.
                    </div>
                )}

                {selectedProgramaSede && (
                    <div className="space-y-2">
                        {indicadores.length === 0 && (
                            <p className="text-sm text-muted-foreground">No hay indicadores registrados.</p>
                        )}
                        {indicadores.map((ind) => {
                            const indItems = itemsByIndicador[ind.id] ?? [];
                            return (
                                <Collapsible key={ind.id} defaultOpen={indItems.length > 0} className="rounded-lg border">
                                    <CollapsibleTrigger className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 group">
                                        <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
                                        <Badge variant="outline" className="text-xs font-mono shrink-0">{ind.codigo}</Badge>
                                        <span className="text-sm flex-1 truncate">{ind.nombre}</span>
                                        {indItems.length > 0 && (
                                            <Badge variant="secondary" className="text-xs shrink-0">
                                                {indItems.filter((i) => i.estado?.nombre?.toLowerCase() === 'completo').length}/{indItems.length}
                                            </Badge>
                                        )}
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="border-t px-4 py-3 space-y-4">
                                            {/* Sección de Resultado Centralizado */}
                                            <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100 mb-2">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
                                                    <BarChart3 className="h-3 w-3" />
                                                    Resultado Final del Indicador
                                                </h4>
                                                <IndicadorResultForm
                                                    indicadorId={ind.id}
                                                    programaId={selectedProgramaSede ?? ''}
                                                    initialValue={resultados.find(r => r.id_indicador === ind.id)?.valor_real ?? ''}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Items de Verificación</h4>
                                                    <Button variant="outline" size="sm" onClick={() => openCreate(ind.id)} className="h-8">
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Agregar Item
                                                    </Button>
                                                </div>
                                                {indItems.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {indItems.map((item) => (
                                                            <ItemRow
                                                                key={item.id}
                                                                item={item}
                                                                estadoItems={estadoItems}
                                                                onEdit={() => openEdit(item)}
                                                                onDelete={() => destroy(item.id)}
                                                                onChangeEstado={(val) => changeEstado(item, val)}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Sin items definidos.</p>
                                                )}
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </div>
                )}

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <form onSubmit={submit}>
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Editar Item' : 'Nuevo Item'}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="nombre_item">Descripción del item</Label>
                                    <Input
                                        id="nombre_item"
                                        value={form.data.nombre_item}
                                        onChange={(e) => form.setData('nombre_item', e.target.value)}
                                        placeholder="Describir la tarea o item..."
                                    />
                                    <InputError message={form.errors.nombre_item} />
                                </div>
                                <div>
                                    <Label>Tipo de Item</Label>
                                    <Select value={form.data.id_tipo_item} onValueChange={(v) => form.setData('id_tipo_item', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tipoItems.map((t) => (
                                                <SelectItem key={t.id} value={t.id.toString()}>{t.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.id_tipo_item} />
                                </div>
                                {editing && (
                                    <div>
                                        <Label>Estado</Label>
                                        <Select value={form.data.id_estado} onValueChange={(v) => form.setData('id_estado', v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {estadoItems.map((e) => (
                                                    <SelectItem key={e.id} value={e.id.toString()}>{e.nombre}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={form.errors.id_estado} />
                                    </div>
                                )}
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="submit" disabled={form.processing}>
                                    {editing ? 'Actualizar' : 'Crear'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <DeleteConfirmDialog
                    open={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                    onConfirm={confirmDelete}
                    title="¿Eliminar item?"
                    description="¿Estás seguro de que deseas eliminar este item? Esta acción no se puede deshacer."
                />
            </div>
        </AppLayout>
    );
}

function ItemRow({
    item,
    estadoItems,
    onEdit,
    onDelete,
    onChangeEstado,
}: {
    item: ItemData;
    estadoItems: EstadoItem[];
    onEdit: () => void;
    onDelete: () => void;
    onChangeEstado: (val: string) => void;
}) {
    return (
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <span className="flex-1">{item.nombre_item}</span>
            {item.tipo_item && (
                <Badge variant="secondary" className="text-xs">{item.tipo_item.nombre}</Badge>
            )}
            <Select value={item.id_estado?.toString() ?? ''} onValueChange={onChangeEstado}>
                <SelectTrigger className="h-7 w-28 text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {estadoItems.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.nombre}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {item.estado && (
                <Badge variant="outline" className={`text-xs ${estadoBadgeClass(item.estado.nombre)}`}>
                    {item.estado.nombre}
                </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
                <Pencil className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
                <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
        </div>
    );
}

function IndicadorResultForm({
    indicadorId,
    programaId,
    initialValue
}: {
    indicadorId: number;
    programaId: string;
    initialValue: string | number
}) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        id_indicador: indicadorId,
        id_programa_sede: programaId,
        valor_real: initialValue ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/indicador-resultados', {
            preserveScroll: true,
            onSuccess: () => { },
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 space-y-1">
                <Label htmlFor={`result-${indicadorId}`} className="text-[10px] text-slate-500 font-bold uppercase">Porcentaje de Cumplimiento Alcanzado (%)</Label>
                <div className="relative">
                    <Input
                        id={`result-${indicadorId}`}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="Ej: 95.00"
                        className="h-9 bg-white pr-8"
                        value={data.valor_real}
                        onChange={(e) => setData('valor_real', e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</div>
                </div>
            </div>
            <Button
                type="submit"
                size="sm"
                className="h-9 px-4 shrink-0 bg-indigo-600 hover:bg-indigo-700"
                disabled={processing || data.valor_real === initialValue}
            >
                {processing ? 'Guardando...' : recentlySuccessful ? 'Guardado' : 'Guardar Resultado'}
            </Button>
        </form>
    );
}
