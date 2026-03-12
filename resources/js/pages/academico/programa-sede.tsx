import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
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

type Sede = {
    id: number;
    nombre: string;
    ciudad: string;
};

type Facultad = {
    id: number;
    nombre: string;
};

type Programa = {
    id: number;
    nombre: string;
    facultad: Facultad | null;
};

type ProgramaSede = {
    id: number;
    id_programa: number;
    id_sede: number;
    programa: Programa | null;
    sede: Sede | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Programa - Sede', href: '/programa-sede' },
];

export default function ProgramaSedeIndex({
    asignaciones,
    programas,
    sedes,
}: {
    asignaciones: ProgramaSede[];
    programas: Programa[];
    sedes: Sede[];
}) {
    const [open, setOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const form = useForm({ id_programa: '', id_sede: '' });

    function openCreate() {
        form.reset();
        setOpen(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/programa-sede', {
            onSuccess: () => setOpen(false),
        });
    }

    function destroy(id: number) {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    }

    function confirmDelete() {
        if (itemToDelete) {
            router.delete(`/programa-sede/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programa - Sede" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Programa - Sede"
                        description="Asignación de programas a sedes"
                    />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Nueva Asignación
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Programa</TableHead>
                                <TableHead>Facultad</TableHead>
                                <TableHead>Sede</TableHead>
                                <TableHead>Ciudad</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {asignaciones.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No hay asignaciones registradas.
                                    </TableCell>
                                </TableRow>
                            )}
                            {asignaciones.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell>{a.id}</TableCell>
                                    <TableCell>{a.programa?.nombre ?? '—'}</TableCell>
                                    <TableCell>{a.programa?.facultad?.nombre ?? '—'}</TableCell>
                                    <TableCell>{a.sede?.nombre ?? '—'}</TableCell>
                                    <TableCell>{a.sede?.ciudad ?? '—'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => destroy(a.id)}>
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
                                <DialogTitle>Nueva Asignación</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <Label htmlFor="id_programa">Programa</Label>
                                    <Select
                                        value={form.data.id_programa}
                                        onValueChange={(val) => form.setData('id_programa', val)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar programa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programas.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>
                                                    {p.nombre} — {p.facultad?.nombre ?? ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.id_programa} />
                                </div>
                                <div>
                                    <Label htmlFor="id_sede">Sede</Label>
                                    <Select
                                        value={form.data.id_sede}
                                        onValueChange={(val) => form.setData('id_sede', val)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar sede" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sedes.map((s) => (
                                                <SelectItem key={s.id} value={String(s.id)}>
                                                    {s.nombre} — {s.ciudad}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.id_sede} />
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="submit" disabled={form.processing}>
                                    Asignar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <DeleteConfirmDialog
                    open={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                    onConfirm={confirmDelete}
                    title="¿Eliminar asignación?"
                    description="¿Estás seguro de que deseas eliminar esta asignación de programa a sede? Esta acción no se puede deshacer."
                />
            </div>
        </AppLayout>
    );
}
