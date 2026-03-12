import { Head, router, useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

type Estandar = { id: number; nombre: string };
type Indicador = { id: number; codigo: string; nombre: string };
type Evidencia = { id: number; codigo: string; descripcion: string };
type Criterio = {
    id: number;
    nombre: string;
    descripcion: string | null;
    id_estandar: number;
    estandar: Estandar | null;
    indicadores: Indicador[];
    evidencias: Evidencia[];
};

type Props = {
    criterios: Criterio[];
    estandares: Estandar[];
    indicadores: Indicador[];
    evidencias: Evidencia[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Criterios', href: '/criterios' },
];

function MultiSelectIndicadores({
    items,
    selected,
    onChange,
}: {
    items: Indicador[];
    selected: number[];
    onChange: (ids: number[]) => void;
}) {
    const [open, setOpen] = useState(false);

    function toggle(id: number) {
        if (selected.includes(id)) {
            onChange(selected.filter((s) => s !== id));
        } else {
            onChange([...selected, id]);
        }
    }

    function remove(id: number) {
        onChange(selected.filter((s) => s !== id));
    }

    const selectedItems = items.filter((i) => selected.includes(i.id));

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal"
                    >
                        {selected.length > 0
                            ? `${selected.length} indicador(es) seleccionado(s)`
                            : 'Seleccionar indicadores...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar indicador..." />
                        <CommandList>
                            <CommandEmpty>No se encontraron indicadores.</CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={`${item.codigo} ${item.nombre}`}
                                        onSelect={() => toggle(item.id)}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selected.includes(item.id) ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                        <span className="font-mono text-xs mr-2">{item.codigo}</span>
                                        {item.nombre}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedItems.map((item) => (
                        <Badge key={item.id} variant="secondary" className="gap-1">
                            {item.codigo}
                            <button
                                type="button"
                                onClick={() => remove(item.id)}
                                className="ml-1 rounded-full outline-none hover:bg-muted"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

function MultiSelectEvidencias({
    items,
    selected,
    onChange,
}: {
    items: Evidencia[];
    selected: number[];
    onChange: (ids: number[]) => void;
}) {
    const [open, setOpen] = useState(false);

    function toggle(id: number) {
        if (selected.includes(id)) {
            onChange(selected.filter((s) => s !== id));
        } else {
            onChange([...selected, id]);
        }
    }

    function remove(id: number) {
        onChange(selected.filter((s) => s !== id));
    }

    const selectedItems = items.filter((i) => selected.includes(i.id));

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal"
                    >
                        {selected.length > 0
                            ? `${selected.length} evidencia(s) seleccionada(s)`
                            : 'Seleccionar evidencias...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar evidencia..." />
                        <CommandList>
                            <CommandEmpty>No se encontraron evidencias.</CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={`${item.codigo} ${item.descripcion}`}
                                        onSelect={() => toggle(item.id)}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selected.includes(item.id) ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                        <span className="font-mono text-xs mr-2">{item.codigo}</span>
                                        <span className="truncate">{item.descripcion}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedItems.map((item) => (
                        <Badge key={item.id} variant="secondary" className="gap-1">
                            {item.codigo}
                            <button
                                type="button"
                                onClick={() => remove(item.id)}
                                className="ml-1 rounded-full outline-none hover:bg-muted"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CriteriosIndex({ criterios, estandares, indicadores, evidencias }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Criterio | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [filtroEstandar, setFiltroEstandar] = useState<string>('all');

    const criteriosFiltrados = filtroEstandar === 'all'
        ? criterios
        : criterios.filter((c) => c.id_estandar?.toString() === filtroEstandar);

    const form = useForm<{
        nombre: string;
        descripcion: string;
        id_estandar: string;
        indicadores: number[];
        evidencias: number[];
    }>({
        nombre: '',
        descripcion: '',
        id_estandar: '',
        indicadores: [],
        evidencias: [],
    });

    function openCreate() {
        setEditing(null);
        form.setData({
            nombre: '',
            descripcion: '',
            id_estandar: '',
            indicadores: [],
            evidencias: [],
        });
        setOpen(true);
    }

    function openEdit(item: Criterio) {
        setEditing(item);
        form.setData({
            nombre: item.nombre ?? '',
            descripcion: item.descripcion ?? '',
            id_estandar: item.id_estandar?.toString() ?? '',
            indicadores: item.indicadores.map((i) => i.id),
            evidencias: item.evidencias.map((e) => e.id),
        });
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/criterios/${editing.id}`, { onSuccess: () => setOpen(false) });
        } else {
            form.post('/criterios', { onSuccess: () => setOpen(false) });
        }
    }

    function destroy(id: number) {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    }

    function confirmDelete() {
        if (itemToDelete) {
            router.delete(`/criterios/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criterios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Criterios" description="Gestionar criterios con indicadores y evidencias" />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Nuevo Criterio
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Label className="text-sm whitespace-nowrap">Filtrar por estándar:</Label>
                    <Select value={filtroEstandar} onValueChange={setFiltroEstandar}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Todos los estándares" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estándares</SelectItem>
                            {estandares.map((est) => (
                                <SelectItem key={est.id} value={est.id.toString()}>
                                    {est.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border overflow-hidden">
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-14">ID</TableHead>
                                <TableHead className="w-1/5">Nombre</TableHead>
                                <TableHead className="w-1/6">Estándar</TableHead>
                                <TableHead>Indicadores</TableHead>
                                <TableHead>Evidencias</TableHead>
                                <TableHead className="w-24 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {criteriosFiltrados.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No hay criterios registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                            {criteriosFiltrados.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.id}</TableCell>
                                    <TableCell className="max-w-0 truncate" title={c.nombre ?? ''}>{c.nombre}</TableCell>
                                    <TableCell className="max-w-0 truncate" title={c.estandar?.nombre ?? ''}>{c.estandar?.nombre}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {c.indicadores.map((ind) => (
                                                <Badge key={ind.id} variant="outline" className="text-xs">
                                                    {ind.codigo}
                                                </Badge>
                                            ))}
                                            {c.indicadores.length === 0 && (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {c.evidencias.map((ev) => (
                                                <Badge key={ev.id} variant="outline" className="text-xs">
                                                    {ev.codigo}
                                                </Badge>
                                            ))}
                                            {c.evidencias.length === 0 && (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => destroy(c.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-2xl">
                        <form onSubmit={submit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editing ? 'Editar Criterio' : 'Nuevo Criterio'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="id_estandar">Estándar</Label>
                                    <Select
                                        value={form.data.id_estandar}
                                        onValueChange={(v) => form.setData('id_estandar', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar estándar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {estandares.map((est) => (
                                                <SelectItem key={est.id} value={est.id.toString()}>
                                                    {est.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.id_estandar} />
                                </div>
                                <div>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                        placeholder="Nombre del criterio"
                                    />
                                    <InputError message={form.errors.nombre} />
                                </div>
                                <div>
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={form.data.descripcion}
                                        onChange={(e) => form.setData('descripcion', e.target.value)}
                                        placeholder="Descripción del criterio"
                                        rows={2}
                                    />
                                    <InputError message={form.errors.descripcion} />
                                </div>
                                <div>
                                    <Label>Indicadores</Label>
                                    <MultiSelectIndicadores
                                        items={indicadores}
                                        selected={form.data.indicadores}
                                        onChange={(ids) => form.setData('indicadores', ids)}
                                    />
                                    <InputError message={form.errors.indicadores} />
                                </div>
                                <div>
                                    <Label>Evidencias</Label>
                                    <MultiSelectEvidencias
                                        items={evidencias}
                                        selected={form.data.evidencias}
                                        onChange={(ids) => form.setData('evidencias', ids)}
                                    />
                                    <InputError message={form.errors.evidencias} />
                                </div>
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
                    title="¿Eliminar criterio?"
                    description="¿Estás seguro de que deseas eliminar este criterio? Se eliminarán también las relaciones con indicadores y evidencias."
                />
            </div>
        </AppLayout>
    );
}
