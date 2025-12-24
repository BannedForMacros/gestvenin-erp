import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Users, 
  Smartphone,
  Menu,
  X,
  MessageCircle,
  Phone,
  ArrowRight
} from 'lucide-react';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const whatsappNumber = "51936651099";
    const whatsappMessage = "Hola, me interesa una demo de GestVenin.";

    const handleWhatsApp = () => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    const handleCall = () => window.location.href = `tel:+${whatsappNumber}`;

    const features = [
        {
            icon: BarChart3,
            title: "Control Financiero",
            description: "Reportes de caja, utilidad y ticket promedio en tiempo real."
        },
        {
            icon: Package,
            title: "Inventario Inteligente",
            description: "Recetas estandarizadas y descuentos automáticos de insumos."
        },
        {
            icon: Users,
            title: "Gestión de Personal",
            description: "Roles, permisos y control de asistencia biométrica."
        },
        {
            icon: Smartphone,
            title: "Comanda Móvil",
            description: "Los mozos toman pedidos desde el celular directo a cocina."
        }
    ];

    return (
        <>
            <Head title="GestVenin - Sistema de Gestión para Restaurantes" />
            
            <div className="min-h-screen bg-slate-50 selection:bg-orange-100 selection:text-orange-900 font-sans text-slate-900">
                
                {/* Navigation */}
                <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-slate-900">GestVenin</span>
                            </div>
                            
                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center gap-8">
                                {canLogin && (
                                    <>
                                        <Link 
                                            href={route('login')}
                                            className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={route('register')}
                                                className="bg-slate-900 text-white font-medium px-6 py-2 rounded-full hover:bg-slate-800 transition-transform hover:scale-105"
                                            >
                                                Registrarse
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Mobile Toggle */}
                            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-white border-t border-slate-100">
                            <div className="flex flex-col p-4 gap-4">
                                {canLogin && (
                                    <>
                                        <Link 
                                            href={route('login')}
                                            className="text-slate-600 py-2"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={route('register')}
                                                className="bg-orange-600 text-white text-center py-2 rounded-lg"
                                            >
                                                Registrarse
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Background Decorativo */}
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/3 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -z-10" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="mb-6 inline-block bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm">
                                    v2.0 Disponible: Nueva Interfaz
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                                    El sistema operativo de tu <span className="text-orange-600">Restaurante</span>.
                                </h1>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                                    Olvídate de las hojas de cálculo y el desorden. Controla inventarios, ventas y personal en una plataforma diseñada para crecer.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        onClick={handleWhatsApp}
                                        className="bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-700 flex items-center justify-center gap-2"
                                    >
                                        Empezar ahora <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={handleCall}
                                        className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-8 py-4 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-4 h-4" /> Agendar llamada
                                    </button>
                                </div>

                                <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex -space-x-2">
                                        {[1,2,3,4].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                                                U
                                            </div>
                                        ))}
                                    </div>
                                    <p>Confían en nosotros +500 restaurantes en Perú</p>
                                </div>
                            </motion.div>

                            {/* Dashboard Mockup */}
                            <motion.div 
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative rounded-2xl bg-slate-900 p-2 shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-2xl" />
                                    <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
                                        {/* Fake UI Header */}
                                        <div className="h-8 bg-slate-900 border-b border-slate-700 flex items-center px-4 gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                        </div>
                                        {/* Fake UI Body */}
                                        <div className="p-6 grid gap-6">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-slate-400 text-sm">Ventas Totales (Hoy)</p>
                                                    <p className="text-3xl font-bold text-white">S/. 4,250.00</p>
                                                </div>
                                                <div className="text-emerald-400 text-sm font-medium">
                                                    +12.5%
                                                </div>
                                            </div>
                                            <div className="h-32 flex items-end justify-between gap-2">
                                                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                        className="w-full bg-orange-600/80 rounded-t-sm"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Todo lo que necesitas en un solo lugar</h2>
                            <p className="text-slate-600">Diseñado por ingenieros, perfeccionado por dueños de restaurantes.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 p-6"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]" />
                    
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Recupera el control de tu negocio</h2>
                        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                            Únete a los restaurantes que ya están optimizando sus costos y aumentando sus ganancias con GestVenin.
                        </p>
                        
                        <button 
                            onClick={handleWhatsApp}
                            className="bg-orange-600 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-lg hover:bg-orange-500 transition-all inline-flex items-center gap-2"
                        >
                            <MessageCircle /> Solicitar Demo Gratuita
                        </button>
                        <p className="mt-4 text-sm text-slate-500">Sin compromiso. No se requiere tarjeta de crédito.</p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white border-t border-slate-100 py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center text-white">
                                <BarChart3 className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-900">GestVenin</span>
                        </div>
                        <div className="text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} MacSoft. Trujillo, Perú.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}