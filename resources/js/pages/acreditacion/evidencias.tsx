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

type Evidencia = {
    id: number;
    codigo: string;
    descripcion: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Evidencias', href: '/evidencias' },
];

export default function EvidenciasIndex({ evidencias }: { evidencias: Evidencia[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Evidencia | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const form = useForm({ codigo: '', descripcion: '' });

    function openCreate() {
        setEditing(null);
        form.reset();
        setOpen(true);
    }

    function openEdit(item: Evidencia) {
        setEditing(item);
        form.setData({
            codigo: item.codigo ?? '',
            descripcion: item.descripcion ?? '',
        });
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/evidencias/${editing.id}`, { onSuccess: () => setOpen(false) });
        } else {
            form.post('/evidencias', { onSuccess: () => setOpen(false) });
        }
    }

    function destroy(id: number) {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    }

    function confirmDelete() {
        if (itemToDelete) {
            router.delete(`/evidencias/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Evidencias" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Evidencias" description="Gestionar evidencias de acreditación" />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Nueva Evidencia
                    </Button>
                </div>

                <div className="rounded-lg border overflow-hidden">
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">ID</TableHead>
                                <TableHead className="w-24">Código</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="w-24 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {evidencias.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No hay evidencias registradas.
                                    </TableCell>
                                </TableRow>
                            )}
                            {evidencias.map((ev) => (
                                <TableRow key={ev.id}>
                                    <TableCell>{ev.id}</TableCell>
                                    <TableCell>{ev.codigo}</TableCell>
                                    <TableCell className="max-w-0 truncate" title={ev.descripcion ?? ''}>{ev.descripcion}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(ev)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => destroy(ev.id)}>
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
                                    {editing ? 'Editar Evidencia' : 'Nueva Evidencia'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="codigo">Código</Label>
                                    <Input
                                        id="codigo"
                                        value={form.data.codigo}
                                        onChange={(e) => form.setData('codigo', e.target.value)}
                                        placeholder="Ej: EV-001"
                                    />
                                    <InputError message={form.errors.codigo} />
                                </div>
                                <div>
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={form.data.descripcion}
                                        onChange={(e) => form.setData('descripcion', e.target.value)}
                                        placeholder="Descripción de la evidencia"
                                        rows={3}
                                    />
                                    <InputError message={form.errors.descripcion} />
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
                    title="¿Eliminar evidencia?"
                    description="¿Estás seguro de que deseas eliminar esta evidencia? Esta acción no se puede deshacer."
                />
            </div>
        </AppLayout>
    );
}
