import { Link, usePage } from '@inertiajs/react';
import { Award, BarChart3, Building2, ChevronRight, CircleDot, ClipboardList, FileCheck, GraduationCap, LayoutGrid, Link2, ListChecks, MapPin, Settings, Tags, Target, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    /**
   {
       title: 'Repository',
       href: 'https://github.com/laravel/react-starter-kit',
       icon: FolderGit2,
   },
   {
       title: 'Documentation',
       href: 'https://laravel.com/docs/starter-kits#react',
       icon: BookOpen,
   },
   */
];

const academicoItems = [
    { title: 'Facultades', href: '/facultades', icon: Building2 },
    { title: 'Sedes', href: '/sedes', icon: MapPin },
    { title: 'Programas', href: '/programas', icon: GraduationCap },
    { title: 'Programa - Sede', href: '/programa-sede', icon: Link2 },
];

const acreditacionItems = [
    { title: 'Estándares', href: '/estandares', icon: Award },
    { title: 'Criterios', href: '/criterios', icon: ClipboardList },
    { title: 'Indicadores', href: '/indicadores', icon: Target },
    { title: 'Evidencias', href: '/evidencias', icon: FileCheck },
];

const coordinadorItems = [
    { title: 'Items Evidencias', href: '/items-evidencias', icon: FileCheck },
    { title: 'Items Indicadores', href: '/items-indicadores', icon: Target },
];

const configuracionItems = [
    { title: 'Tipo de Item', href: '/tipo-item', icon: Tags },
    { title: 'Estado de Item', href: '/estado-item', icon: CircleDot },
];

export function AppSidebar() {
    const { isCurrentUrl } = useCurrentUrl();
    const { auth, config } = usePage().props as any;
    const roles = auth.roles ?? [];
    const isAdmin = roles.includes('admin');
    const isCoordinador = roles.includes('coordinador');
    const isDecanato = roles.includes('decanato');

    const visibleMainNavItems: NavItem[] = [];

    if (isAdmin) {
        visibleMainNavItems.push(
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
            { title: 'Usuarios', href: '/usuarios', icon: Users }
        );
    } else {
        visibleMainNavItems.push({ title: 'Dashboard', href: dashboard(), icon: LayoutGrid });
    }

    if (isDecanato) {
        if (config?.sidebar_decanato_dashboard) {
            visibleMainNavItems.push({ title: 'Dashboard Decanato', href: '/decanato', icon: BarChart3 });
        }
        if (config?.sidebar_decanato_seguimiento) {
            visibleMainNavItems.push({ title: 'Seguimiento Detallado', href: '/decanato/seguimiento', icon: ListChecks });
        }
        if (config?.sidebar_decanato_indicadores) {
            visibleMainNavItems.push({ title: 'Resumen de Indicadores', href: '/decanato/indicadores', icon: Target });
        }
    }

    const academicoActive = academicoItems.some((item) => isCurrentUrl(item.href));
    const acreditacionActive = acreditacionItems.some((item) => isCurrentUrl(item.href));
    const coordinadorActive = coordinadorItems.some((item) => isCurrentUrl(item.href));
    const configuracionActive = configuracionItems.some((item) => isCurrentUrl(item.href));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleMainNavItems} />

                {isAdmin && <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Gestión Académica</SidebarGroupLabel>
                    <SidebarMenu>
                        <Collapsible defaultOpen={academicoActive} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Gestión Académica" isActive={academicoActive}>
                                        <GraduationCap />
                                        <span>Académico</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {academicoItems.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(item.href)}>
                                                    <Link href={item.href} prefetch>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>}

                {isAdmin && <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Acreditación</SidebarGroupLabel>
                    <SidebarMenu>
                        <Collapsible defaultOpen={acreditacionActive} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Acreditación" isActive={acreditacionActive}>
                                        <Award />
                                        <span>Acreditación</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {acreditacionItems.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(item.href)}>
                                                    <Link href={item.href} prefetch>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>}

                {(isAdmin || isCoordinador) && <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Coordinación</SidebarGroupLabel>
                    <SidebarMenu>
                        <Collapsible defaultOpen={coordinadorActive} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Coordinación" isActive={coordinadorActive}>
                                        <ListChecks />
                                        <span>Coordinación</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {coordinadorItems.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(item.href)}>
                                                    <Link href={item.href} prefetch>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>}

                {isAdmin && <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Configuración</SidebarGroupLabel>
                    <SidebarMenu>
                        <Collapsible defaultOpen={configuracionActive} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Configuración" isActive={configuracionActive}>
                                        <Settings />
                                        <span>Configuración</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {configuracionItems.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(item.href)}>
                                                    <Link href={item.href} prefetch>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isCurrentUrl('/configuracion')}>
                                <Link href="/configuracion">
                                    <Settings />
                                    <span>Ajustes del Sistema</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
