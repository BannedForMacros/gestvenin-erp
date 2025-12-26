import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Select from '@/Components/Select';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function CreateForm({ empresas, roles, locales, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        empresa_id: '',
        role_id: '',
        local_id: '',
    });

    const [selectedRole, setSelectedRole] = useState(null);
    const [availableLocales, setAvailableLocales] = useState([]);

    // Filtrar locales cuando cambia la empresa
    useEffect(() => {
        if (data.empresa_id) {
            const filtered = locales.filter(local => local.empresa_id === parseInt(data.empresa_id));
            setAvailableLocales(filtered);
            
            // Si el local actual no pertenece a la nueva empresa, limpiarlo
            if (data.local_id && !filtered.find(l => l.id === parseInt(data.local_id))) {
                setData('local_id', '');
            }
        } else {
            setAvailableLocales([]);
            setData('local_id', '');
        }
    }, [data.empresa_id]);

    // Actualizar rol seleccionado
    useEffect(() => {
        if (data.role_id) {
            const role = roles.find(r => r.id === parseInt(data.role_id));
            setSelectedRole(role);
            
            // Si es rol global, limpiar el local
            if (role?.es_global) {
                setData('local_id', '');
            }
        } else {
            setSelectedRole(null);
        }
    }, [data.role_id]);

    const empresaOptions = empresas.map(empresa => ({
        value: empresa.id,
        label: empresa.nombre_comercial || empresa.razon_social,
    }));

    const roleOptions = roles.map(role => ({
        value: role.id,
        label: role.nombre,
    }));

    const localOptions = availableLocales.map(local => ({
        value: local.id,
        label: local.nombre,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('configuracion.usuarios.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Nombre */}
                <div className="md:col-span-2">
                    <Label htmlFor="name" value="Nombre Completo" required />
                    <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        placeholder="Juan Pérez"
                    />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                    <Label htmlFor="email" value="Email" required />
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        placeholder="juan@ejemplo.com"
                    />
                </div>

                {/* Password */}
                <div>
                    <Label htmlFor="password" value="Contraseña" required />
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        placeholder="Mínimo 8 caracteres"
                    />
                </div>

                {/* Password Confirmation */}
                <div>
                    <Label htmlFor="password_confirmation" value="Confirmar Contraseña" required />
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                        placeholder="Repite la contraseña"
                    />
                </div>

                {/* Empresa */}
                <div>
                    <Label htmlFor="empresa_id" value="Empresa" required />
                    <Select
                        id="empresa_id"
                        value={data.empresa_id}
                        onChange={(e) => setData('empresa_id', e.target.value)}
                        options={empresaOptions}
                        error={errors.empresa_id}
                        placeholder="Selecciona una empresa"
                    />
                </div>

                {/* Rol */}
                <div>
                    <Label htmlFor="role_id" value="Rol" required />
                    <Select
                        id="role_id"
                        value={data.role_id}
                        onChange={(e) => setData('role_id', e.target.value)}
                        options={roleOptions}
                        error={errors.role_id}
                        placeholder="Selecciona un rol"
                    />
                </div>

                {/* Local */}
                <div className="md:col-span-2">
                    <Label 
                        htmlFor="local_id" 
                        value="Local" 
                        required={selectedRole && !selectedRole.es_global}
                    />
                    <Select
                        id="local_id"
                        value={data.local_id}
                        onChange={(e) => setData('local_id', e.target.value)}
                        options={localOptions}
                        error={errors.local_id}
                        placeholder={
                            !data.empresa_id 
                                ? "Primero selecciona una empresa" 
                                : selectedRole?.es_global 
                                ? "No requerido para roles globales"
                                : "Selecciona un local"
                        }
                        disabled={!data.empresa_id || (selectedRole?.es_global)}
                    />
                    {selectedRole?.es_global && (
                        <p className="mt-1 text-sm text-gray-500">
                            El rol seleccionado es global y no requiere local específico
                        </p>
                    )}
                </div>
            </div>

            <Modal.Footer>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="success" loading={processing}>
                    Crear Usuario
                </Button>
            </Modal.Footer>
        </form>
    );
}