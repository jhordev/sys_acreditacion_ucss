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

type Estandar = {
    id: number;
    nombre: string;
    titulo: string | null;
    descripcion: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Estándares', href: '/estandares' },
];

export default function EstandaresIndex({ estandares }: { estandares: Estandar[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Estandar | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const form = useForm({ nombre: '', titulo: '', descripcion: '' });

    function openCreate() {
        setEditing(null);
        form.reset();
        setOpen(true);
    }

    function openEdit(item: Estandar) {
        setEditing(item);
        form.setData({
            nombre: item.nombre ?? '',
            titulo: item.titulo ?? '',
            descripcion: item.descripcion ?? '',
        });
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/estandares/${editing.id}`, { onSuccess: () => setOpen(false) });
        } else {
            form.post('/estandares', { onSuccess: () => setOpen(false) });
        }
    }

    function destroy(id: number) {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    }

    function confirmDelete() {
        if (itemToDelete) {
            router.delete(`/estandares/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Estándares" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Estándares" description="Gestionar estándares de acreditación" />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Nuevo Estándar
                    </Button>
                </div>

                <div className="rounded-lg border overflow-hidden">
                    <Table className="table-fixed">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">ID</TableHead>
                                <TableHead className="w-1/4">Nombre</TableHead>
                                <TableHead className="w-1/4">Título</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="w-24 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {estandares.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No hay estándares registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                            {estandares.map((e) => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.id}</TableCell>
                                    <TableCell className="max-w-0 truncate" title={e.nombre ?? ''}>{e.nombre}</TableCell>
                                    <TableCell className="max-w-0 truncate" title={e.titulo ?? ''}>{e.titulo}</TableCell>
                                    <TableCell className="max-w-0 truncate" title={e.descripcion ?? ''}>{e.descripcion}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(e)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => destroy(e.id)}>
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
                                    {editing ? 'Editar Estándar' : 'Nuevo Estándar'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                        placeholder="Nombre del estándar"
                                    />
                                    <InputError message={form.errors.nombre} />
                                </div>
                                <div>
                                    <Label htmlFor="titulo">Título</Label>
                                    <Input
                                        id="titulo"
                                        value={form.data.titulo}
                                        onChange={(e) => form.setData('titulo', e.target.value)}
                                        placeholder="Título del estándar"
                                    />
                                    <InputError message={form.errors.titulo} />
                                </div>
                                <div>
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={form.data.descripcion}
                                        onChange={(e) => form.setData('descripcion', e.target.value)}
                                        placeholder="Descripción del estándar"
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
                    title="¿Eliminar estándar?"
                    description="¿Estás seguro de que deseas eliminar este estándar? Esta acción no se puede deshacer."
                />
            </div>
        </AppLayout>
    );
}
