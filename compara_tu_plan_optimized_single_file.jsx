import React, { useEffect, useMemo, useState } from 'react';
import {
  Wifi,
  Phone,
  ChevronRight,
  Check,
  Star,
  Shield,
  Zap,
  Users,
  Search,
  PhoneCall,
  CheckCircle,
  Info,
  Building,
  User,
  Tv,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// IMPORT NOTE: replace the logo import below with your actual logo file path
// import Logo from '../public/logo.png';

/**
 * ComparaTuPlan - Simplified & Optimized single-file React component
 * - Ready to drop into a Next.js / Create React App project
 * - Uses TailwindCSS classes for styling (install tailwind in your project)
 * - Uses framer-motion for nice transitions (install framer-motion)
 * - Uses lucide-react for icons (install lucide-react)
 *
 * Deployment notes:
 *  - Ensure Tailwind is configured and built for production on Vercel
 *  - Install dependencies: "lucide-react", "framer-motion"
 *  - Replace commented Logo import with your asset
 */

const ComparaTuPlan = () => {
  // Step state: 'landing' | 'quiz' | 'coverage' | 'results' | 'confirmation' | 'sent'
  const [step, setStep] = useState('landing');

  // Form state (kept flat for simplicity)
  const [answers, setAnswers] = useState({});

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showTooltip, setShowTooltip] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Acceptances
  const [isMayorDeEdad, setIsMayorDeEdad] = useState(false);
  const [habeaData, setHabeaData] = useState(false);

  // --- Static lists ---
  const colombianCities = useMemo(() => [
    'Arauca','Armenia','Barranquilla','Bogotá D.C.','Bucaramanga','Buenaventura','Cali','Cartagena','Cúcuta','Florencia','Ibagué','Leticia','Manizales','Medellín','Montería','Neiva','Pasto','Pereira','Popayán','Quibdó','Riohacha','San Andrés','Santa Marta','Sincelejo','Tunja','Valledupar','Villavicencio','Yopal'
  ], []);

  const localidadesPorCiudad = useMemo(() => ({
    'Bogotá D.C.': ['Usaquén','Chapinero','Santa Fe','San Cristóbal','Usme','Tunjuelito','Bosa','Kennedy','Fontibón','Engativá','Suba','Barrios Unidos','Teusaquillo','Antonio Nariño','Puente Aranda','Ciudad Bolívar'],
    'Medellín': ['Popular','Santa Cruz','Manrique','Castilla','Robledo','La Candelaria','Laureles','El Poblado','Belén'],
    'Cali': ['Aguablanca','Centro','Norte','Sur','San Antonio','Granada'],
    'Barranquilla': ['Norte','Riomar','Sur Occidente','Metropolitana']
  }), []);

  const streamingPlatforms = useMemo(() => [
    { id: 'netflix', name: 'Netflix', operators: ['Claro','Movistar'] },
    { id: 'disney', name: 'Disney+', operators: ['Movistar'] },
    { id: 'hbo', name: 'HBO Max', operators: ['Claro'] },
    { id: 'paramount', name: 'Paramount+', operators: ['Tigo'] },
    { id: 'spotify', name: 'Spotify Premium', operators: ['Claro','Movistar'] }
  ], []);

  const tecnologiaTerminos = useMemo(() => ({
    'ftth': { title: 'Fibra Óptica (FTTH)', desc: 'Fiber To The Home - conexión directa hasta tu hogar, alta estabilidad.' , icon: '🌐' },
    'velocidadSimetrica': { title: 'Velocidad Simétrica', desc: 'Subida y bajada con la misma velocidad, ideal para videollamadas.' , icon: '⚡' },
    'streaming': { title: 'Streaming', desc: 'Transmisión de contenido en tiempo real.' , icon: '📺' },
    'wifi': { title: 'WiFi', desc: 'Conexión inalámbrica; WiFi 6 mejora rendimiento en muchos dispositivos.' , icon: '📡' },
    'tvApp': { title: 'TV App', desc: 'Ver canales y contenido en apps sin decodificador.' , icon: '📱' },
    'tvDecodificador': { title: 'TV con Decodificador', desc: 'Televisión tradicional con decodificador físico.' , icon: '📦' },
    '4g': { title: 'Red 4G', desc: 'Conectividad móvil ampliamente disponible.' , icon: '📶' },
    '5g': { title: 'Red 5G', desc: 'Baja latencia y altas velocidades para gaming y streaming.' , icon: '🚀' }
  }), []);

  const planes = useMemo(() => ([
    { operator: 'Claro', name: 'Internet Fibra 200 Mbps', type: ['internet'], price: 89900, speed: 200, tech: 'FTTH', benefits: ['HBO Max','WiFi 6'], users: 4, rating: 4.5 },
    { operator: 'Movistar', name: 'Móvil 20GB 4G/5G', type: ['movil'], price: 45900, benefits: ['20GB datos','Llamadas ilimitadas'], users: 1, rating: 4.3 },
    { operator: 'Tigo', name: 'Internet + TV', type: ['internet','tv'], price: 125900, speed: 300, benefits: ['140 canales','Paramount+'], users: 4, rating: 4.4 },
    { operator: 'ETB', name: 'Fibra Empresarial 500', type: ['internet'], price: 189900, speed: 500, tech: 'FTTH Simétrica', benefits: ['IP fija','Soporte 24/7'], users: 10, rating: 4.7, isPyme: true },
    { operator: 'Claro', name: 'Paquete Completo', type: ['internet','tv','movil','fija'], price: 159900, speed: 300, benefits: ['Netflix','Línea fija','TV App'], users: 5, rating: 4.6 }
  ]), []);

  const questions = useMemo(() => ([
    { id: 'tipoCliente', question: '¿Eres persona natural o empresa?', type: 'tipoCliente' },
    { id: 'city', question: '¿En qué ciudad vives?', type: 'select', options: colombianCities },
    { id: 'address', question: '¿Cuál es tu dirección?', type: 'address' },
    { id: 'servicios', question: '¿Qué servicios necesitas?', subtitle: 'Selecciona todos los que apliquen', type: 'multipleServices' },
    { id: 'streamingPlatforms', question: '¿Qué plataformas de streaming te interesan?', subtitle: 'Selecciona las que más uses', type: 'streamingPlatforms', showIf: (ans) => ans.servicios && ans.servicios.includes('streaming') },
    { id: 'usage', question: '¿Para qué lo usas principalmente? (máximo 2)', type: 'multiple', maxSelections: 2, options: [{ value: 'trabajo', label: 'Trabajo remoto', tooltip: 'velocidadSimetrica' }, { value: 'streaming', label: 'Streaming', tooltip: 'streaming' }, { value: 'gaming', label: 'Gaming', tooltip: '5g' }, { value: 'basico', label: 'Navegar y redes' }] },
    { id: 'users', question: '¿Cuántas personas lo usarán?', type: 'select', options: ['1 persona','2 personas','3 personas','4 personas','5 o más'] }
  ]), [colombianCities]);

  // --- Helpers ---
  const getLocalidades = () => localidadesPorCiudad[answers.city] || ['Centro','Norte','Sur'];

  const handleAnswer = (qId, value) => {
    if (qId === 'address') {
      setAnswers(prev => ({ ...prev, address: { ...prev.address, ...value } }));
      return;
    }

    if (qId === 'servicios' || qId === 'streamingPlatforms') {
      setAnswers(prev => {
        const current = prev[qId] || [];
        if (current.includes(value)) return { ...prev, [qId]: current.filter(v => v !== value) };
        return { ...prev, [qId]: [...current, value] };
      });
      return;
    }

    if (qId === 'usage') {
      setAnswers(prev => {
        const current = prev[qId] || [];
        if (current.includes(value)) return { ...prev, [qId]: current.filter(v => v !== value) };
        if ((current.length || 0) < 2) return { ...prev, [qId]: [...current, value] };
        return prev;
      });
      return;
    }

    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const canProceed = (index = currentQuestion) => {
    const q = questions[index];
    if (!q) return true;
    if (q.showIf && !q.showIf(answers)) return true;
    if (q.type === 'address') {
      const a = answers.address || {};
      return !!(a.streetType && a.streetNumber && a.separator && a.houseNumber && a.localidad && a.estrato);
    }
    if (q.type === 'multipleServices') return answers.servicios && answers.servicios.length > 0;
    if (q.type === 'streamingPlatforms') return true; // optional
    if (q.type === 'multiple') return answers[q.id] && answers[q.id].length > 0;
    return !!answers[q.id];
  };

  const nextQ = () => {
    // move forward respecting showIf
    let nextIndex = currentQuestion + 1;
    while (nextIndex < questions.length) {
      const nxt = questions[nextIndex];
      if (!nxt.showIf || nxt.showIf(answers)) {
        setCurrentQuestion(nextIndex);
        return;
      }
      nextIndex++;
    }
    // all done -> coverage
    setStep('coverage');
    // Simulate coverage check then move to results
    setTimeout(() => setStep('results'), 1200);
  };

  const prevQ = () => {
    let prevIndex = currentQuestion - 1;
    while (prevIndex >= 0) {
      const prev = questions[prevIndex];
      if (!prev.showIf || prev.showIf(answers)) {
        setCurrentQuestion(prevIndex);
        return;
      }
      prevIndex--;
    }
  };

  const startQuiz = () => {
    if (!habeaData || !isMayorDeEdad) {
      window.alert('Por favor acepta las casillas para continuar');
      return;
    }
    setStep('quiz');
    setCurrentQuestion(0);
  };

  // Filter plans based on answers
  const filteredPlanes = useMemo(() => {
    return planes.filter(plan => {
      // Exclude enterprise-only plans if user is natural
      if (answers.tipoCliente === 'natural' && plan.isPyme) return false;
      // If user selected services, ensure plan covers at least one
      if (answers.servicios && answers.servicios.length > 0) {
        const has = answers.servicios.some(s => plan.type.includes(s));
        if (!has) return false;
      }
      return true;
    });
  }, [plans, answers]);

  // Confirmation send simulation
  const sendOrder = () => {
    // minimal validation
    const required = ['city','address','tipoCliente'];
    for (const r of required) {
      if (!answers[r]) {
        window.alert('Falta información: ' + r);
        return;
      }
    }
    // Simulate send then go to final screen
    setStep('sent');
  };

  // Small UI helpers
  const Tooltip = ({ term }) => {
    const info = tecnologiaTerminos[term];
    if (!info) return null;
    return (
      <div className="relative inline-block">
        <button
          aria-label={`info ${info.title}`}
          type="button"
          onMouseEnter={() => setShowTooltip(term)}
          onMouseLeave={() => setShowTooltip(null)}
          onClick={(e) => { e.stopPropagation(); setShowTooltip(showTooltip === term ? null : term); }}
          className="ml-2 w-5 h-5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 inline-flex items-center justify-center"
        >
          <Info size={14} />
        </button>
        {showTooltip === term && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl">
            <div className="text-lg mb-1">{info.icon} {info.title}</div>
            <div className="text-xs text-gray-300">{info.desc}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  // --- Render different steps ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg flex items-center">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <span className="text-lg font-semibold">ComparaTuPlan.com</span>
              <div className="text-xs text-gray-500">Compara y contrata — rápido</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-sm text-gray-600">Soporte</a>
            <a href="#" className="text-sm text-gray-600">Cómo funciona</a>
            <a href="https://wa.me/573057876992" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-50 px-3 py-2 rounded-full text-green-700 font-semibold">
              <PhoneCall size={16} /> Ayuda
            </a>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="pt-28 pb-12 px-4">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.section key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Encuentra el Plan Perfecto de <span className="text-blue-600">Telecomunicaciones</span></h1>
              <p className="text-lg text-gray-700 mb-8">Compara operadores, precios y beneficios en segundos.</p>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6 mx-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Shield className="text-yellow-600" size={20} /> Autorización de Tratamiento de Datos</h3>
                <div className="space-y-3 text-left">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" checked={isMayorDeEdad} onChange={(e) => setIsMayorDeEdad(e.target.checked)} />
                    <span className="text-sm"><strong>Declaro ser mayor de edad</strong> (18 años o más)</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" checked={habeaData} onChange={(e) => setHabeaData(e.target.checked)} />
                    <span className="text-sm">Acepto la Política de Tratamiento de Datos Personales (Ley 1581/2012)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button onClick={startQuiz} disabled={!habeaData || !isMayorDeEdad} className={`px-8 py-4 rounded-xl font-bold inline-flex items-center gap-3 ${(habeaData && isMayorDeEdad) ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                  Comparar Planes <ChevronRight size={18} />
                </button>
                <a href="/" className="px-6 py-4 rounded-xl bg-white border font-semibold">Ver demo</a>
              </div>
            </motion.section>
          )}

          {step === 'quiz' && (
            <motion.section key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                <QuestionRenderer
                  questions={questions}
                  currentQuestion={currentQuestion}
                  answers={answers}
                  handleAnswer={handleAnswer}
                  canProceed={canProceed}
                  nextQ={nextQ}
                  prevQ={prevQ}
                  Tooltip={Tooltip}
                />
              </div>
            </motion.section>
          )}

          {step === 'coverage' && (
            <motion.section key="coverage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="bg-white rounded-full p-6 inline-block mb-6 shadow-xl">
                  <Search className="text-blue-600 animate-pulse" size={64} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Validando Cobertura...</h2>
                <p className="text-gray-600">Verificando operadores disponibles para tu dirección</p>
              </div>
            </motion.section>
          )}

          {step === 'results' && (
            <motion.section key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto">
              <ResultsView filteredPlanes={filteredPlanes} answers={answers} onSelect={(plan) => { setSelectedPlan(plan); setStep('confirmation'); }} />
            </motion.section>
          )}

          {step === 'confirmation' && selectedPlan && (
            <motion.section key="confirm" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Confirmar contratación</h2>
                <p className="text-gray-600 mb-6">Vas a solicitar: <strong>{selectedPlan.operator} — {selectedPlan.name}</strong></p>
                <div className="space-y-4 text-left mb-6">
                  <div>Ciudad: <strong>{answers.city}</strong></div>
                  <div>Localidad: <strong>{answers.address?.localidad}</strong></div>
                  <div>Dirección: <strong>{answers.address?.streetType} {answers.address?.streetNumber}{answers.address?.letter} {answers.address?.separator} {answers.address?.houseNumber}</strong></div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button onClick={() => setStep('results')} className="px-6 py-3 rounded-xl border font-semibold">Volver</button>
                  <button onClick={sendOrder} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold">Enviar Solicitud</button>
                </div>
              </div>
            </motion.section>
          )}

          {step === 'sent' && (
            <motion.section key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
              <div className="bg-green-500 rounded-2xl p-8 text-white text-center">
                <div className="inline-block mb-6">
                  <CheckCircle size={64} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">¡Solicitud Enviada!</h3>
                <p className="mb-6">Hemos recibido tu solicitud para <strong>{selectedPlan?.operator}</strong>. Un asesor te contactará pronto.</p>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => { setStep('landing'); setAnswers({}); setCurrentQuestion(0); setSelectedPlan(null); }} className="px-6 py-3 rounded-xl bg-white text-green-600 font-bold">Volver al inicio</button>
                  <a href="https://wa.me/573057876992?text=Solicit%C3%A9%20un%20plan" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl border border-white">WhatsApp</a>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ----- Subcomponents -----

const QuestionRenderer = ({ questions, currentQuestion, answers, handleAnswer, canProceed, nextQ, prevQ, Tooltip }) => {
  const q = questions[currentQuestion];
  if (!q) return null;

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-bold mb-2">{q.question}</h2>
      {q.subtitle && <p className="text-gray-600 mb-6">{q.subtitle}</p>}

      {/* Render based on type */}
      {q.type === 'tipoCliente' && (
        <div className="grid md:grid-cols-2 gap-4">
          <button onClick={() => handleAnswer('tipoCliente', 'natural')} className={`p-6 rounded-2xl border-2 text-center ${answers.tipoCliente === 'natural' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
            <User size={44} className="mx-auto mb-2 text-blue-600" />
            <div className="font-bold">Persona Natural</div>
          </button>
          <button onClick={() => handleAnswer('tipoCliente', 'pyme')} className={`p-6 rounded-2xl border-2 text-center ${answers.tipoCliente === 'pyme' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
            <Building size={44} className="mx-auto mb-2 text-blue-600" />
            <div className="font-bold">Empresa / PYME</div>
          </button>
        </div>
      )}

      {q.type === 'select' && (
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(q.id, opt)} className={`w-full p-4 rounded-xl border-2 text-left ${answers[q.id] === opt ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
              <span className="text-lg">{opt}</span>
            </button>
          ))}
        </div>
      )}

      {q.type === 'address' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <select value={answers.address?.streetType || ''} onChange={(e) => handleAnswer('address', { streetType: e.target.value })} className="col-span-2 p-3 border-2 rounded-xl">
              <option value="">Tipo de vía</option>
              {['Calle','Carrera','Avenida','Diagonal','Transversal'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="text" placeholder="Número" value={answers.address?.streetNumber || ''} onChange={(e) => handleAnswer('address', { streetNumber: e.target.value })} className="p-3 border-2 rounded-xl" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <select value={answers.address?.letter || ''} onChange={(e) => handleAnswer('address', { letter: e.target.value })} className="p-3 border-2 rounded-xl">
              <option value="">Letra</option>
              {Array.from('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ').map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={answers.address?.separator || ''} onChange={(e) => handleAnswer('address', { separator: e.target.value })} className="p-3 border-2 rounded-xl">
              <option value="">Separador</option>
              {['#','Bis','Sur','Norte'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="text" placeholder="Nro" value={answers.address?.houseNumber || ''} onChange={(e) => handleAnswer('address', { houseNumber: e.target.value })} className="p-3 border-2 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select value={answers.address?.localidad || ''} onChange={(e) => handleAnswer('address', { localidad: e.target.value })} className="p-3 border-2 rounded-xl">
              <option value="">Localidad</option>
              {['Centro','Norte','Sur'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={answers.address?.estrato || ''} onChange={(e) => handleAnswer('address', { estrato: e.target.value })} className="p-3 border-2 rounded-xl">
              <option value="">Estrato</option>
              {[1,2,3,4,5,6].map(e => <option key={e} value={e}>Estrato {e}</option>)}
            </select>
          </div>

          {answers.address?.streetType && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Vista previa:</p>
              <p className="text-lg font-bold text-blue-900">{answers.address.streetType} {answers.address.streetNumber}{answers.address.letter} {answers.address.separator} {answers.address.houseNumber}, {answers.address.localidad} - Estrato {answers.address.estrato}</p>
            </div>
          )}
        </div>
      )}

      {q.type === 'multipleServices' && (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { id: 'internet', label: 'Internet', icon: Wifi, tooltip: 'ftth' },
            { id: 'movil', label: 'Móvil', icon: Smartphone, tooltip: '4g' },
            { id: 'tv', label: 'TV', icon: Tv, tooltip: 'tvDecodificador' },
            { id: 'fija', label: 'Línea Fija', icon: Phone },
            { id: 'streaming', label: 'Streaming', icon: Star, tooltip: 'streaming' }
          ].map(opt => {
            const isSelected = (answers.servicios || []).includes(opt.id);
            return (
              <button key={opt.id} onClick={() => handleAnswer('servicios', opt.id)} className={`p-5 rounded-2xl border-2 text-center ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <opt.icon size={26} className="text-blue-600" />
                  {opt.tooltip && <Tooltip term={opt.tooltip} />}
                </div>
                <div className="font-semibold">{opt.label}</div>
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'streamingPlatforms' && (
        <div className="space-y-3">
          {streamingPlatforms.map(platform => {
            const selected = (answers.streamingPlatforms || []).includes(platform.id);
            return (
              <button key={platform.id} onClick={() => handleAnswer('streamingPlatforms', platform.id)} className={`w-full p-4 rounded-xl border-2 text-left ${selected ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{platform.name}</div>
                    <div className="text-sm text-gray-500">Disponible con: {platform.operators.join(', ')}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'multiple' && (
        <div className="space-y-3">
          {q.options.map(opt => {
            const isSelected = (answers[q.id] || []).includes(opt.value);
            const canSelect = isSelected || ((answers[q.id] || []).length < 2);
            return (
              <button key={opt.value} onClick={() => handleAnswer(q.id, opt.value)} disabled={!canSelect} className={`w-full p-4 rounded-xl border-2 text-left ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'} ${!canSelect ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{opt.label}</div>
                    {opt.tooltip && <Tooltip term={opt.tooltip} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-4 mt-8">
        {currentQuestion > 0 && <button onClick={prevQ} className="px-6 py-3 rounded-full border">← Anterior</button>}
        <div className="ml-auto">
          <button onClick={nextQ} disabled={!canProceed()} className={`px-6 py-3 rounded-full font-semibold ${canProceed() ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>{currentQuestion >= questions.length - 1 ? 'Ver Resultados' : 'Siguiente →'}</button>
        </div>
      </div>
    </div>
  );
};

const ResultsView = ({ filteredPlanes, answers, onSelect }) => {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-4 bg-green-100 text-green-800">
          <CheckCircle size={18} /> <strong>¡Cobertura confirmada!</strong>
        </div>
        <h2 className="text-3xl font-bold">Encontramos {filteredPlanes.length} Planes para ti</h2>
        <div className="text-gray-600">Disponibles en {answers.address?.localidad || 'tu zona'}, {answers.city}</div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {filteredPlanes.map((plan, i) => (
          <div key={i} className={`relative bg-white rounded-2xl shadow p-6 ${i===0? 'border-4 border-yellow-400' : 'border'} `}>
            {i===0 && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-bold">⭐ MEJOR OPCIÓN</div>}
            <div className="text-center mb-4">
              <div className="text-lg font-bold">{plan.operator}</div>
              <div className="text-sm text-gray-600">{plan.name}</div>
            </div>

            <div className="text-center my-4">
              <div className="text-2xl font-bold text-blue-600">${plan.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500">por mes</div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              {plan.speed && <div className="flex items-center gap-2"><Wifi size={16} /> {plan.speed} Mbps</div>}
              <div className="flex items-center gap-2"><Users size={16} /> {plan.users} personas</div>
              <div className="flex items-center gap-2"><Star size={16} /> {plan.rating}/5</div>
              {plan.isPyme && <div className="flex items-center gap-2 text-purple-600 font-semibold"><Building size={16} /> Empresarial</div>}
            </div>

            <div className="border-t pt-3 mb-4">
              <div className="text-sm font-semibold mb-2">Beneficios</div>
              <ul className="text-sm space-y-1">
                {plan.benefits.map((b, j) => <li key={j} className="flex items-start gap-2"><Check size={14} className="text-green-500"/> {b}</li>)}
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={() => onSelect(plan)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold">Contratar</button>
              <a href={`https://wa.me/573057876992?text=Hola,%20quiero%20info%20del%20plan%20${encodeURIComponent(plan.name)}`} target="_blank" rel="noreferrer" className="flex-1 border rounded-lg py-2 inline-flex items-center justify-center gap-2">WhatsApp</a>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-500 rounded-2xl p-6 text-white text-center">
        <div className="font-bold text-lg">¿Necesitas ayuda?</div>
        <div className="text-sm mb-4">Un asesor experto puede guiarte en la contratación</div>
        <a href="https://wa.me/573057876992?text=Hola,%20necesito%20ayuda%20con%20un%20plan" target="_blank" rel="noreferrer" className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold inline-flex items-center gap-2"> <PhoneCall size={16} /> WhatsApp</a>
      </div>
    </div>
  );
};

export default ComparaTuPlan;
