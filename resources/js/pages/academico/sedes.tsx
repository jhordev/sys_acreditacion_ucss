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

type Sede = {
    id: number;
    nombre: string;
    ciudad: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sedes', href: '/sedes' },
];

export default function Sedes({ sedes }: { sedes: Sede[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Sede | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const form = useForm({ nombre: '', ciudad: '' });

    function openCreate() {
        setEditing(null);
        form.reset();
        setOpen(true);
    }

    function openEdit(sede: Sede) {
        setEditing(sede);
        form.setData({
            nombre: sede.nombre,
            ciudad: sede.ciudad,
        });
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/sedes/${editing.id}`, {
                onSuccess: () => setOpen(false),
            });
        } else {
            form.post('/sedes', {
                onSuccess: () => setOpen(false),
            });
        }
    }

    function destroy(id: number) {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    }

    function confirmDelete() {
        if (itemToDelete) {
            router.delete(`/sedes/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sedes" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Sedes" description="Gestión de sedes" />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Nueva Sede
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Ciudad</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sedes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No hay sedes registradas.
                                    </TableCell>
                                </TableRow>
                            )}
                            {sedes.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.id}</TableCell>
                                    <TableCell>{s.nombre}</TableCell>
                                    <TableCell>{s.ciudad}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => destroy(s.id)}>
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
                                    {editing ? 'Editar Sede' : 'Nueva Sede'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                        placeholder="Nombre de la sede"
                                    />
                                    <InputError message={form.errors.nombre} />
                                </div>
                                <div>
                                    <Label htmlFor="ciudad">Ciudad</Label>
                                    <Input
                                        id="ciudad"
                                        value={form.data.ciudad}
                                        onChange={(e) => form.setData('ciudad', e.target.value)}
                                        placeholder="Ciudad"
                                    />
                                    <InputError message={form.errors.ciudad} />
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
                    title="¿Eliminar sede?"
                    description="¿Estás seguro de que deseas eliminar esta sede? Esta acción no se puede deshacer."
                />
            </div>
        </AppLayout>
    );
}
