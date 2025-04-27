import React, { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

// Lista de categorías y condiciones para el producto
const productCategories = [
  { value: 'books', label: 'Libros' },
  { value: 'electronics', label: 'Electrónicos' },
  { value: 'clothing', label: 'Ropa' },
  { value: 'furniture', label: 'Muebles' },
  { value: 'services', label: 'Servicios' },
  { value: 'tickets', label: 'Boletos' },
  { value: 'housing', label: 'Alojamiento' },
  { value: 'other', label: 'Otro' }
];

const productConditions = [
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como nuevo' },
  { value: 'good', label: 'Buen estado' },
  { value: 'fair', label: 'Estado regular' },
  { value: 'poor', label: 'Estado pobre' }
];

const campusLocations = [
  { value: 'fcs', label: 'Facultad de Ciencias Sociales' },
  { value: 'fing', label: 'Facultad de Ingeniería' },
  { value: 'flet', label: 'Facultad de Letras' },
  { value: 'fedu', label: 'Facultad de Educación' },
  { value: 'biodoc', label: 'Biblioteca Carlos Monge' }
];

const NewListingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    condition: '',
    isAnonymous: false,
    contactInfo: {
      phone: '',
      whatsapp: '',
      email: ''
    },
    location: {
      type: 'campus',
      campus: '',
      locationName: ''
    },
    endDate: null,
    photos: []
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
      
      // Clear error if field was in error
      if (errors[`${parent}.${child}`]) {
        setErrors(prev => ({
          ...prev,
          [`${parent}.${child}`]: null
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error if field was in error
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  const handleLocationTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        type
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a cero';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }
    
    if (!formData.condition) {
      newErrors.condition = 'La condición es requerida';
    }
    
    // Verificar que al menos un método de contacto fue proporcionado
    if (!formData.contactInfo.phone && !formData.contactInfo.whatsapp && !formData.contactInfo.email) {
      newErrors['contactInfo.phone'] = 'Se requiere al menos un método de contacto';
    }
    
    // Verificar ubicación
    if (formData.location.type === 'campus' && !formData.location.campus) {
      newErrors['location.campus'] = 'Selecciona una ubicación en el campus';
    }
    
    if (formData.location.type === 'express' && !formData.location.locationName) {
      newErrors['location.locationName'] = 'Proporciona un nombre para la ubicación';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form data:', formData);
      // Aquí se enviaría el formulario
      alert('Anuncio publicado con éxito!');
    } else {
      console.log('Form has errors', errors);
    }
  };

  return (
    <div className="new-listing-form">
      <style jsx>{`
        .new-listing-form {
          background-color: rgba(5, 5, 25, 0.95);
          padding: 2rem;
          border-radius: 8px;
          border: 1px solid var(--neon-primary);
          box-shadow: 0 0 20px rgba(39, 79, 166, 0.52);
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Rajdhani', sans-serif;
        }

        .form-title {
          color: var(--neon-primary);
          text-align: center;
          margin-bottom: 2rem;
          text-transform: uppercase;
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 2px;
          text-shadow: 0 0 10px var(--neon-primary);
        }

        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .form-field {
          flex: 1;
          min-width: 250px;
          margin-bottom: 1.5rem;
        }

        .form-field.full-width {
          width: 100%;
          flex-basis: 100%;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--neon-primary);
          font-weight: 500;
        }

        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(7, 22, 54, 0.79);
          border: 1px solid var(--neon-primary);
          border-radius: 4px;
          color: white;
          font-family: 'Rajdhani', sans-serif;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--neon-blue);
          box-shadow: 0 0 10px rgba(9, 37, 99, 0.5);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .input-with-icon {
          display: flex;
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neon-primary);
          display: flex;
          align-items: center;
        }

        .input-with-icon input {
          padding-left: 36px;
        }

        .checkbox-field {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .checkbox-field input {
          width: auto;
          margin-right: 10px;
        }

        .checkbox-field label {
          margin-bottom: 0;
          color: white;
        }

        .section-divider {
          position: relative;
          text-align: center;
          margin: 2rem 0;
          border-bottom: 1px solid rgba(39, 79, 166, 0.2);
        }

        .section-divider span {
          position: relative;
          top: 0.7em;
          background-color: rgba(5, 5, 25, 0.95);
          padding: 0 1rem;
          color: var(--neon-primary);
          font-size: 0.9rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .location-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .location-button {
          padding: 0.75rem 1.5rem;
          border: 1px solid var(--neon-primary);
          background-color: transparent;
          color: var(--neon-primary);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .location-button.active {
          background-color: var(--neon-primary);
          color: black;
        }

        .location-button:hover:not(.active) {
          background-color: rgba(39, 79, 166, 0.1);
        }

        .map-placeholder {
          height: 200px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed var(--neon-primary);
          color: var(--neon-primary);
          margin-top: 1rem;
        }

        .photo-upload {
          padding: 2rem;
          border: 1px dashed var(--neon-primary);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          margin-bottom: 1.5rem;
        }

        .photo-upload-icon {
          color: var(--neon-primary);
          font-size: 2.5rem;
        }

        .photo-upload-text {
          color: white;
        }

        .photo-upload-subtext {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
        }

        .form-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        .cancel-button {
          padding: 0.75rem 1.5rem;
          background-color: transparent;
          border: 1px solid white;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .submit-button {
          padding: 0.75rem 2.5rem;
          background-color: var(--neon-primary);
          border: none;
          color: black;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .submit-button:hover {
          background-color: var(--neon-blue);
          box-shadow: 0 0 15px var(--neon-blue);
        }

        .error-message {
          color: var(--neon-red);
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        .input-error {
          border-color: var(--neon-red);
        }
        
        .three-columns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .three-columns .form-field {
          flex: 1 1 calc(33.333% - 1rem);
          min-width: 180px;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
          }
          
          .form-field {
            min-width: 100%;
          }
          
          .three-columns .form-field {
            flex: 1 1 100%;
          }
        }
      `}</style>

      <h1 className="form-title">Publicar Nuevo Anuncio</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="title">Título del anuncio *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'input-error' : ''}
              placeholder="Título del anuncio"
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-field">
            <label htmlFor="price">Precio (colones) *</label>
            <div className="input-with-icon">
              <span className="input-icon">₡</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'input-error' : ''}
                placeholder="Precio"
              />
            </div>
            {errors.price && <div className="error-message">{errors.price}</div>}
          </div>
        </div>
        
        <div className="form-field full-width">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'input-error' : ''}
            rows={4}
            placeholder="Describe tu producto o servicio"
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-row three-columns">
          <div className="form-field">
            <label htmlFor="category">Categoría *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'input-error' : ''}
            >
              <option value="" disabled>Selecciona categoría</option>
              {productCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {errors.category && <div className="error-message">{errors.category}</div>}
          </div>
          
          <div className="form-field">
            <label htmlFor="condition">Condición *</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className={errors.condition ? 'input-error' : ''}
            >
              <option value="" disabled>Selecciona condición</option>
              {productConditions.map(cond => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
            {errors.condition && <div className="error-message">{errors.condition}</div>}
          </div>
          
          <div className="form-field">
            <label htmlFor="endDate">Disponible hasta (opcional)</label>
            <input 
              type="date" 
              id="endDate" 
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="checkbox-field">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="isAnonymous">Publicar anónimamente</label>
        </div>
        
        <div className="section-divider">
          <span>Información de Contacto</span>
        </div>
        
        <div className="form-row three-columns">
          <div className="form-field">
            <label htmlFor="contactInfo.phone">Teléfono (opcional)</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <PhoneIcon />
              </span>
              <input
                type="tel"
                id="contactInfo.phone"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                className={errors['contactInfo.phone'] ? 'input-error' : ''}
                placeholder="Teléfono"
              />
            </div>
            {errors['contactInfo.phone'] && <div className="error-message">{errors['contactInfo.phone']}</div>}
          </div>
          
          <div className="form-field">
            <label htmlFor="contactInfo.whatsapp">WhatsApp (opcional)</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <WhatsAppIcon />
              </span>
              <input
                type="tel"
                id="contactInfo.whatsapp"
                name="contactInfo.whatsapp"
                value={formData.contactInfo.whatsapp}
                onChange={handleChange}
                placeholder="WhatsApp"
              />
            </div>
          </div>
          
          <div className="form-field">
            <label htmlFor="contactInfo.email">Email (opcional)</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <EmailIcon />
              </span>
              <input
                type="email"
                id="contactInfo.email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
          </div>
        </div>
        
        <div className="section-divider">
          <span>Ubicación</span>
        </div>
        
        <div className="location-buttons">
          <button 
            type="button"
            className={`location-button ${formData.location.type === 'campus' ? 'active' : ''}`}
            onClick={() => handleLocationTypeChange('campus')}
          >
            <LocationOnIcon /> Campus
          </button>
          
          <button 
            type="button"
            className={`location-button ${formData.location.type === 'express' ? 'active' : ''}`}
            onClick={() => handleLocationTypeChange('express')}
          >
            <LocalShippingIcon /> Express
          </button>
        </div>
        
        {formData.location.type === 'campus' ? (
          <>
            <div className="form-field">
              <label htmlFor="location.campus">Ubicación en el campus *</label>
              <select
                id="location.campus"
                name="location.campus"
                value={formData.location.campus}
                onChange={handleChange}
                className={errors['location.campus'] ? 'input-error' : ''}
              >
                <option value="" disabled>Selecciona ubicación</option>
                {campusLocations.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
              {errors['location.campus'] && <div className="error-message">{errors['location.campus']}</div>}
            </div>
            
            <div className="map-placeholder">
              <span>Selector de mapa aquí</span>
            </div>
          </>
        ) : (
          <div className="form-field">
            <label htmlFor="location.locationName">Nombre de ubicación (Express) *</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <LocalShippingIcon />
              </span>
              <input
                type="text"
                id="location.locationName"
                name="location.locationName"
                value={formData.location.locationName}
                onChange={handleChange}
                className={errors['location.locationName'] ? 'input-error' : ''}
                placeholder="Ej. Sur de San José, Entrega en todo el país, etc."
              />
            </div>
            {errors['location.locationName'] && <div className="error-message">{errors['location.locationName']}</div>}
          </div>
        )}
        
        <div className="section-divider">
          <span>Fotos</span>
        </div>
        
        <div className="photo-upload">
          <div className="photo-upload-icon">
            <PhotoCameraIcon style={{ fontSize: 40 }} />
          </div>
          <div className="photo-upload-text">Haz clic para subir fotos</div>
          <div className="photo-upload-subtext">Máximo 5 imágenes</div>
        </div>
        
        <div className="form-buttons">
          <button type="button" className="cancel-button">
            Cancelar
          </button>
          
          <button type="submit" className="submit-button">
            Publicar Anuncio
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewListingForm;