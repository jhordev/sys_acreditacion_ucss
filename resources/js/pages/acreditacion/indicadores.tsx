import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Indicador = {
    id: number;
    codigo: string;
    nombre: string;
    tipo_dato: string | null;
    objetivo: string | null;
    valor_referencial: number | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Indicadores', href: '/indicadores' },
];

export default function IndicadoresIndex({ indicadores }: { indicadores: Indicador[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Indicador | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const form = useForm({
        codigo: '',
        nombre: '',
        tipo_dato: '',
        objetivo: '',
        valor_referencial: '',
    });

    function openCreate() {
        setEditing(null);
        form.reset();
        setOpen(true);
    }

    function openEdit(item: Indicador) {
        setEditing(item);
        form.setData({
            codigo: item.codigo ?? '',
            nombre: item.nombre ?? '',
            tipo_dato: item.tipo_dato ?? '',
            objetivo: item.objetivo ?? '',
            valor_referencial: item.valor_referencial?.toString() ?? '',
        });
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/indicadores/${editing.id}`, { onSuccess: () => setOpen(false) });
        } else {
            form.post('/indicadores', { onSuccess: () => setOpen(false) });
        }
    }

    function destroy(id: number) {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    }

    function confirmDelete() {
        if (itemToDelete) {
            router.delete(`/indicadores/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Indicadores" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Indicadores" description="Gestionar indicadores de acreditación" />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Nuevo Indicador
                    </Button>
                </div>

                <div className="rounded-lg border overflow-hidden">
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-14">ID</TableHead>
                                <TableHead className="w-24">Código</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead className="w-24">Tipo Dato</TableHead>
                                <TableHead>Objetivo</TableHead>
                                <TableHead className="w-24">Valor Ref.</TableHead>
                                <TableHead className="w-24 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {indicadores.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No hay indicadores registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                            {indicadores.map((ind) => (
                                <TableRow key={ind.id}>
                                    <TableCell>{ind.id}</TableCell>
                                    <TableCell>{ind.codigo}</TableCell>
                                    <TableCell className="max-w-0 truncate" title={ind.nombre ?? ''}>{ind.nombre}</TableCell>
                                    <TableCell>{ind.tipo_dato}</TableCell>
                                    <TableCell className="max-w-0 truncate" title={ind.objetivo ?? ''}>{ind.objetivo}</TableCell>
                                    <TableCell>{ind.valor_referencial}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(ind)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => destroy(ind.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <form onSubmit={submit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editing ? 'Editar Indicador' : 'Nuevo Indicador'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="codigo">Código</Label>
                                    <Input
                                        id="codigo"
                                        value={form.data.codigo}
                                        onChange={(e) => form.setData('codigo', e.target.value)}
                                        placeholder="Ej: IND-001"
                                    />
                                    <InputError message={form.errors.codigo} />
                                </div>
                                <div>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                        placeholder="Nombre del indicador"
                                    />
                                    <InputError message={form.errors.nombre} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="tipo_dato">Tipo de Dato</Label>
                                        <Input
                                            id="tipo_dato"
                                            value={form.data.tipo_dato}
                                            onChange={(e) => form.setData('tipo_dato', e.target.value)}
                                            placeholder="Ej: porcentaje"
                                        />
                                        <InputError message={form.errors.tipo_dato} />
                                    </div>
                                    <div>
                                        <Label htmlFor="valor_referencial">Valor Referencial</Label>
                                        <Input
                                            id="valor_referencial"
                                            type="number"
                                            step="0.01"
                                            value={form.data.valor_referencial}
                                            onChange={(e) => form.setData('valor_referencial', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        <InputError message={form.errors.valor_referencial} />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="objetivo">Objetivo</Label>
                                    <Input
                                        id="objetivo"
                                        value={form.data.objetivo}
                                        onChange={(e) => form.setData('objetivo', e.target.value)}
                                        placeholder="Objetivo del indicador"
                                    />
                                    <InputError message={form.errors.objetivo} />
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
                    title="¿Eliminar indicador?"
                    description="¿Estás seguro de que deseas eliminar este indicador? Esta acción no se puede deshacer."
                />
            </div>
        </AppLayout>
    );
}
