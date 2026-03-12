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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

type Facultad = {
    id: number;
    nombre: string;
};

type Programa = {
    id: number;
    nombre: string;
    id_facultad: number;
    facultad: Facultad | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programas', href: '/programas' },
];

export default function Programas({
    programas,
    facultades,
}: {
    programas: Programa[];
    facultades: Facultad[];
}) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Programa | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const form = useForm({ nombre: '', id_facultad: '' });

    function openCreate() {
        setEditing(null);
        form.reset();
        setOpen(true);
    }

    function openEdit(programa: Programa) {
        setEditing(programa);
        form.setData({
            nombre: programa.nombre,
            id_facultad: String(programa.id_facultad),
        });
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/programas/${editing.id}`, {
                onSuccess: () => setOpen(false),
            });
        } else {
            form.post('/programas', {
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
            router.delete(`/programas/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Programas" description="Gestión de programas académicos" />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Nuevo Programa
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Facultad</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programas.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No hay programas registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                            {programas.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.id}</TableCell>
                                    <TableCell>{p.nombre}</TableCell>
                                    <TableCell>{p.facultad?.nombre ?? '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => destroy(p.id)}>
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
                                    {editing ? 'Editar Programa' : 'Nuevo Programa'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        value={form.data.nombre}
                                        onChange={(e) => form.setData('nombre', e.target.value)}
                                        placeholder="Nombre del programa"
                                    />
                                    <InputError message={form.errors.nombre} />
                                </div>
                                <div>
                                    <Label htmlFor="id_facultad">Facultad</Label>
                                    <Select
                                        value={form.data.id_facultad}
                                        onValueChange={(val) => form.setData('id_facultad', val)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar facultad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {facultades.map((f) => (
                                                <SelectItem key={f.id} value={String(f.id)}>
                                                    {f.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.id_facultad} />
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
                    title="¿Eliminar programa?"
                    description="¿Estás seguro de que deseas eliminar este programa? Esta acción no se puede deshacer."
                />
            </div>
        </AppLayout>
    );
}
