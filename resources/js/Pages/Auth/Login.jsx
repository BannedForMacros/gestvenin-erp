import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Mail, Lock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Carrusel de imágenes
    const [currentImage, setCurrentImage] = useState(0);
    const images = [
        '/images/carrusel1.png',
        '/images/carrusel2.png',
        '/images/carrusel3.png',
        '/images/carrusel4.png',
    ];

    // Auto-rotate carrusel cada 5 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Iniciar Sesión" />

            <div className="min-h-screen bg-slate-50 flex">
                
                {/* Panel Izquierdo - Carrusel */}
                <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
                    {/* Carrusel de Imágenes */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImage}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0"
                        >
                            <img 
                                src={images[currentImage]} 
                                alt={`Carrusel ${currentImage + 1}`}
                                className="w-full h-full object-contain bg-slate-900"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Logo sobre el carrusel */}
                    <div className="absolute top-8 left-8 z-10 flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white drop-shadow-lg">GestVenin</span>
                    </div>

                    {/* Controles del Carrusel */}
                    <div className="absolute bottom-8 left-8 right-8 z-10 flex items-center justify-between">
                        <div className="flex gap-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === currentImage 
                                            ? 'bg-orange-600 w-8' 
                                            : 'bg-white/50 w-1.5 hover:bg-white/70'
                                    }`}
                                    aria-label={`Ir a imagen ${index + 1}`}
                                />
                            ))}
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={prevImage}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors"
                                aria-label="Siguiente imagen"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Panel Derecho - Formulario de Login */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        {/* Logo Mobile */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                <BarChart3 className="w-7 h-7" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">GestVenin</span>
                        </div>

                        {/* Título */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido de nuevo</h1>
                            <p className="text-slate-600">Ingresa tus credenciales para acceder al sistema</p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
                            >
                                {status}
                            </motion.div>
                        )}

                        {/* Formulario */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <InputLabel htmlFor="email" value="Correo Electrónico" className="mb-2 text-slate-700 font-medium" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel htmlFor="password" value="Contraseña" className="mb-2 text-slate-700 font-medium" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-slate-600">Recordarme</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <PrimaryButton 
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                                disabled={processing}
                            >
                                {processing ? 'Ingresando...' : 'Iniciar Sesión'}
                                {!processing && <ArrowRight className="w-4 h-4" />}
                            </PrimaryButton>
                        </form>

                        {/* Registro */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-600 text-sm">
                                ¿No tienes una cuenta?{' '}
                                <Link 
                                    href={route('register')} 
                                    className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                                >
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
                            © {new Date().getFullYear()} MacSoft. Todos los derechos reservados.
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}