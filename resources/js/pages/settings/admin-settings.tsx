import { Head, router, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { update as updateConfig } from '@/routes/configuracion';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ajustes de Administración',
        href: '/configuracion',
    },
];

interface Configuracion {
    id: number;
    clave: string;
    valor: string;
}

interface Props {
    configuraciones: Configuracion[];
}

export default function AdminSettings({ configuraciones }: Props) {
    const { processing } = useForm({
        clave: '',
        valor: ''
    });

    const handleToggle = (clave: string, checked: boolean) => {
        const nuevoValor = checked ? '1' : '0';
        router.put(updateConfig().url, { clave, valor: nuevoValor }, {
            preserveScroll: true,
        });
    };

    const getConfigValue = (clave: string) => {
        return configuraciones.find(c => c.clave === clave)?.valor === '1';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de Administración" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Ajustes de Administración"
                        description="Gestiona la visibilidad de los módulos del sistema"
                    />

                    <div className="space-y-6 rounded-lg border p-6 bg-card shadow-sm">
                        <div className="flex flex-col space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Módulo Decanato</h3>
                                <p className="text-sm text-muted-foreground mt-1">Activa o desactiva la visibilidad de las opciones para el Decanato.</p>
                            </div>

                            {/* Dashboard Decanato */}
                            <div className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="dashboard_decanato"
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                                        checked={getConfigValue('sidebar_decanato_dashboard')}
                                        onChange={(e) => handleToggle('sidebar_decanato_dashboard', e.target.checked)}
                                        disabled={processing}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <Label
                                        htmlFor="dashboard_decanato"
                                        className="text-sm font-semibold cursor-pointer select-none"
                                    >
                                        Dashboard Decanato
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        Muestra el acceso al tablero principal de control.
                                    </span>
                                </div>
                            </div>

                            {/* Seguimiento Detallado */}
                            <div className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="seguimiento_decanato"
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                                        checked={getConfigValue('sidebar_decanato_seguimiento')}
                                        onChange={(e) => handleToggle('sidebar_decanato_seguimiento', e.target.checked)}
                                        disabled={processing}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <Label
                                        htmlFor="seguimiento_decanato"
                                        className="text-sm font-semibold cursor-pointer select-none"
                                    >
                                        Seguimiento Detallado
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        Habilita la sección de seguimiento minucioso por estándares.
                                    </span>
                                </div>
                            </div>

                            {/* Resumen de Indicadores */}
                            <div className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="indicadores_decanato"
                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                                        checked={getConfigValue('sidebar_decanato_indicadores')}
                                        onChange={(e) => handleToggle('sidebar_decanato_indicadores', e.target.checked)}
                                        disabled={processing}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <Label
                                        htmlFor="indicadores_decanato"
                                        className="text-sm font-semibold cursor-pointer select-none"
                                    >
                                        Resumen de Indicadores
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        Permite visualizar el resumen consolidado de indicadores.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
