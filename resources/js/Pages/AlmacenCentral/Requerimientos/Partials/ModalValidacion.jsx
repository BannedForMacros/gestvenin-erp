import { useState } from 'react';
import Modal from '@/Components/Modal';
import Button from '@/Components/Button';
import Label from '@/Components/Label';
import Textarea from '@/Components/Textarea';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ModalValidacion({ 
    show, 
    onClose, 
    title, 
    tipo = 'aprobar', // 'aprobar' o 'rechazar'
    onConfirm 
}) {
    const [observacion, setObservacion] = useState('');

    const handleConfirm = () => {
        if (tipo === 'rechazar' && !observacion.trim()) {
            alert('Debe proporcionar una observación para rechazar');
            return;
        }

        onConfirm(observacion);
        setObservacion('');
    };

    const handleClose = () => {
        setObservacion('');
        onClose();
    };

    const isAprobar = tipo === 'aprobar';

    return (
        <Modal
            show={show}
            onClose={handleClose}
            title={title}
            maxWidth="md"
        >
            <div className="space-y-4">
                {/* Icono y mensaje */}
                <div className={`rounded-lg p-4 ${isAprobar ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-start gap-3">
                        {isAprobar ? (
                            <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                        ) : (
                            <XCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
                        )}
                        <div className="flex-1">
                            <h3 className={`font-semibold ${isAprobar ? 'text-green-900' : 'text-red-900'}`}>
                                {isAprobar ? '¿Aprobar este requerimiento?' : '¿Rechazar este requerimiento?'}
                            </h3>
                            <p className={`mt-1 text-sm ${isAprobar ? 'text-green-700' : 'text-red-700'}`}>
                                {isAprobar 
                                    ? 'Una vez aprobado, el requerimiento podrá ser procesado para compra.'
                                    : 'El requerimiento será marcado como rechazado y deberá ser corregido.'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Observación */}
                <div>
                    <Label 
                        htmlFor="observacion" 
                        value={isAprobar ? "Observación (opcional)" : "Observación"} 
                        required={!isAprobar}
                    />
                    <Textarea
                        id="observacion"
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        rows={4}
                        placeholder={
                            isAprobar 
                                ? "Agregue algún comentario si lo desea..."
                                : "Explique el motivo del rechazo..."
                        }
                    />
                    {!isAprobar && (
                        <p className="mt-1 text-sm text-red-600">
                            * La observación es obligatoria para rechazar
                        </p>
                    )}
                </div>
            </div>

            <Modal.Footer>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                >
                    Cancelar
                </Button>
                <Button
                    type="button"
                    variant={isAprobar ? 'success' : 'danger'}
                    onClick={handleConfirm}
                >
                    {isAprobar ? (
                        <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Aprobar Requerimiento
                        </>
                    ) : (
                        <>
                            <XCircle className="mr-2 h-5 w-5" />
                            Rechazar Requerimiento
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}