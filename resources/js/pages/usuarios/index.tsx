import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
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

type Role = {
    id: number;
    nombre: string;
    descripcion: string;
};

type Facultad = {
    id: number;
    nombre: string;
};

type Sede = {
    id: number;
    nombre: string;
    ciudad: string;
};

type Programa = {
    id: number;
    nombre: string;
};

type ProgramaSedeType = {
    id: number;
    id_programa: number;
    id_sede: number;
    programa: Programa | null;
    sede: Sede | null;
};

type Asignacion = {
    id?: number;
    id_rol: number | string;
    id_facultad?: number | string | null;
    id_programa_sede?: number | string | null;
    rol?: Role | null;
    facultad?: Facultad | null;
    programa_sede?: ProgramaSedeType | null;
};

type Usuario = {
    id: number;
    name: string;
    email: string;
    estado: string | null;
    asignaciones: Asignacion[];
};

type AsignacionForm = {
    id_rol: string;
    id_facultad: string;
    id_programa_sede: string;
};

type FormData = {
    name: string;
    email: string;
    password: string;
    estado: string;
    asignaciones: AsignacionForm[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Usuarios', href: '/usuarios' },
];

const EMPTY_ASIGNACION: AsignacionForm = { id_rol: '', id_facultad: '', id_programa_sede: '' };

export default function Usuarios({
    usuarios,
    roles,
    facultades,
    programaSedes,
}: {
    usuarios: Usuario[];
    roles: Role[];
    facultades: Facultad[];
    programaSedes: ProgramaSedeType[];
}) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Usuario | null>(null);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const form = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        estado: 'activo',
        asignaciones: [{ ...EMPTY_ASIGNACION }],
    });

    function getRolNombre(rolId: string | number): string {
        return roles.find((r) => r.id === Number(rolId))?.nombre ?? '';
    }

    function isDecanato(rolId: string): boolean {
        return getRolNombre(rolId) === 'decanato';
    }

    function isCoordinador(rolId: string): boolean {
        return getRolNombre(rolId) === 'coordinador';
    }

    function openCreate() {
        setEditing(null);
        form.setData({
            name: '',
            email: '',
            password: '',
            estado: 'activo',
            asignaciones: [{ ...EMPTY_ASIGNACION }],
        });
        form.clearErrors();
        setOpen(true);
    }

    function openEdit(usuario: Usuario) {
        setEditing(usuario);
        form.setData({
            name: usuario.name,
            email: usuario.email,
            password: '',
            estado: usuario.estado ?? 'activo',
            asignaciones: usuario.asignaciones.length > 0
                ? usuario.asignaciones.map((a) => ({
                    id_rol: String(a.id_rol ?? a.rol?.id ?? ''),
                    id_facultad: a.id_facultad ? String(a.id_facultad) : '',
                    id_programa_sede: a.id_programa_sede ? String(a.id_programa_sede) : '',
                }))
                : [{ ...EMPTY_ASIGNACION }],
        });
        form.clearErrors();
        setOpen(true);
    }

    function addAsignacion() {
        form.setData('asignaciones', [
            ...form.data.asignaciones,
            { ...EMPTY_ASIGNACION },
        ]);
    }

    function removeAsignacion(index: number) {
        if (form.data.asignaciones.length <= 1) return;
        const updated = form.data.asignaciones.filter((_, i) => i !== index);
        form.setData('asignaciones', updated);
    }

    function updateAsignacion(index: number, field: keyof AsignacionForm, value: string) {
        const updated = [...form.data.asignaciones];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'id_rol') {
            const rolNombre = getRolNombre(value);
            if (rolNombre === 'decanato') {
                updated[index].id_programa_sede = '';
            } else if (rolNombre === 'coordinador') {
                updated[index].id_facultad = '';
            } else {
                updated[index].id_facultad = '';
                updated[index].id_programa_sede = '';
            }
        }

        form.setData('asignaciones', updated);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (editing) {
            form.put(`/usuarios/${editing.id}`, {
                onSuccess: () => setOpen(false),
            });
        } else {
            form.post('/usuarios', {
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
            router.delete(`/usuarios/${itemToDelete}`, {
                onSuccess: () => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                },
            });
        }
    }

    function getProgramaSedeLabel(ps: ProgramaSedeType) {
        return `${ps.programa?.nombre ?? '?'} — ${ps.sede?.nombre ?? '?'} (${ps.sede?.ciudad ?? ''})`;
    }

    function renderAsignacionBadge(a: Asignacion) {
        const rolNombre = a.rol?.nombre ?? '-';
        if (rolNombre === 'decanato' && a.facultad) {
            return rolNombre + ' > ' + a.facultad.nombre;
        }
        if (rolNombre === 'coordinador' && a.programa_sede) {
            return rolNombre + ' > ' + a.programa_sede.programa?.nombre + ' / ' + a.programa_sede.sede?.nombre;
        }
        return rolNombre;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Usuarios" description="Gestión de usuarios y asignación de roles" />
                    <Button onClick={openCreate}>
                        <Plus className="mr-1 h-4 w-4" />
                        Nuevo Usuario
                    </Button>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Roles / Asignaciones</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usuarios.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No hay usuarios registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                            {usuarios.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>{u.id}</TableCell>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.estado === 'activo' ? 'default' : 'secondary'}>
                                            {u.estado ?? '—'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {u.asignaciones.map((a, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {renderAsignacionBadge(a)}
                                                </Badge>
                                            ))}
                                            {u.asignaciones.length === 0 && <span className="text-muted-foreground">Sin asignaciones</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => destroy(u.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={submit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editing ? 'Editar Usuario' : 'Nuevo Usuario'}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="mt-4 space-y-4">
                                {/* Datos del usuario */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            value={form.data.name}
                                            onChange={(e) => form.setData('name', e.target.value)}
                                            placeholder="Nombre completo"
                                        />
                                        <InputError message={form.errors.name} />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            placeholder="correo@ejemplo.com"
                                        />
                                        <InputError message={form.errors.email} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="password">
                                            Contraseña{editing && <span className="text-muted-foreground text-xs ml-1">(dejar vacío para mantener)</span>}
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={form.data.password}
                                            onChange={(e) => form.setData('password', e.target.value)}
                                            placeholder={editing ? '••••••' : 'Mínimo 6 caracteres'}
                                        />
                                        <InputError message={form.errors.password} />
                                    </div>
                                    <div>
                                        <Label htmlFor="estado">Estado</Label>
                                        <Select
                                            value={form.data.estado}
                                            onValueChange={(val) => form.setData('estado', val)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccionar estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="activo">Activo</SelectItem>
                                                <SelectItem value="inactivo">Inactivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={form.errors.estado} />
                                    </div>
                                </div>

                                <Separator />

                                {/* Asignaciones de rol */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-base">Asignaciones de Rol</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addAsignacion}>
                                            <Plus className="mr-1 h-3 w-3" />
                                            Agregar
                                        </Button>
                                    </div>
                                    <InputError message={form.errors.asignaciones} />

                                    <div className="space-y-3">
                                        {form.data.asignaciones.map((asig, index) => (
                                            <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                                                <div className="flex-1 space-y-2">
                                                    <div>
                                                        <Label className="text-xs">Rol</Label>
                                                        <Select
                                                            value={asig.id_rol}
                                                            onValueChange={(val) => updateAsignacion(index, 'id_rol', val)}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Seleccionar rol" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {roles.map((r) => (
                                                                    <SelectItem key={r.id} value={String(r.id)}>
                                                                        {r.nombre}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={(form.errors as Record<string, string>)[`asignaciones.${index}.id_rol`]} />
                                                    </div>
                                                    {isDecanato(asig.id_rol) && (
                                                        <div>
                                                            <Label className="text-xs">
                                                                Facultad
                                                                <span className="text-muted-foreground ml-1">(acceso a todos sus programas y sedes)</span>
                                                            </Label>
                                                            <Select
                                                                value={asig.id_facultad || '_none'}
                                                                onValueChange={(val) => updateAsignacion(index, 'id_facultad', val === '_none' ? '' : val)}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Seleccionar facultad" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="_none">Sin asignar</SelectItem>
                                                                    {facultades.map((f) => (
                                                                        <SelectItem key={f.id} value={String(f.id)}>
                                                                            {f.nombre}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError message={(form.errors as Record<string, string>)[`asignaciones.${index}.id_facultad`]} />
                                                        </div>
                                                    )}

                                                    {isCoordinador(asig.id_rol) && (
                                                        <div>
                                                            <Label className="text-xs">
                                                                Programa - Sede
                                                                <span className="text-muted-foreground ml-1">(programa especifico en una sede)</span>
                                                            </Label>
                                                            <Select
                                                                value={asig.id_programa_sede || '_none'}
                                                                onValueChange={(val) => updateAsignacion(index, 'id_programa_sede', val === '_none' ? '' : val)}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Seleccionar programa-sede" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="_none">Sin asignar</SelectItem>
                                                                    {programaSedes.map((ps) => (
                                                                        <SelectItem key={ps.id} value={String(ps.id)}>
                                                                            {getProgramaSedeLabel(ps)}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <InputError message={(form.errors as Record<string, string>)[`asignaciones.${index}.id_programa_sede`]} />
                                                        </div>
                                                    )}
                                                </div>
                                                {form.data.asignaciones.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mt-5 shrink-0"
                                                        onClick={() => removeAsignacion(index)}
                                                    >
                                                        <X className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="mt-6">
                                <Button type="submit" disabled={form.processing}>
                                    {editing ? 'Actualizar' : 'Crear Usuario'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <DeleteConfirmDialog
                    open={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                    onConfirm={confirmDelete}
                    title="¿Eliminar usuario?"
                    description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
                />
            </div>
        </AppLayout>
    );
}

