import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './UserForm.module.css';
import validateUser from './UserValidate';
import { useNavigate } from 'react-router-dom';
import { imageUpload, signUpNewUser } from '../../redux/actions/Actions';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import Loading from './Spinner';

interface FormValues {
  profilePictureName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture?: string | null;
  country: string;
  city: string;
  address: string;
}

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  profilePicture: null,
  country: '',
  city: '',
  address: '',
  profilePictureName: ''
};

const UserForm: React.FC = () => {
  const [profilePictureUrl, setProfilePictureUrl] = useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 
  const history = useNavigate();
  const dispatch = useDispatch();
  
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await signUp(values, dispatch);
      setIsSubmitting(false)
      history('/');
    } catch (error) {
      console.error("Error al crear la cuenta:", error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    setProfilePictureUrl(selectedFile);
  };

  const signUp = async (values: FormValues, dispatch: any) => {
    try {
        let urlImage: string | null = null;
  
        if (profilePictureUrl !== undefined) {
          urlImage = await imageUpload(profilePictureUrl);
        } else {
          urlImage = ''
        }

        console.log("Valores para signUpNewUser:", values.email, values.password, values.firstName, values.lastName, urlImage, values.country, values.city, values.address, false, true);
        await dispatch(signUpNewUser(values.email, values.password, values.firstName, values.lastName, urlImage, values.country, values.city, values.address, false, true)); 
      
        Swal.fire({
          title: 'Cuenta creada',
          text: 'Tu cuenta ha sido creada exitosamente, Revisa tu Email para más información',
          icon: 'success',
          confirmButtonText: 'Entendido'
        });
    } catch (error) {
      console.error("Error al crear cuenta:", error);
      Swal.fire({
        title: 'Error al crear cuenta',
        text: 'Hubo un problema al intentar crear tu cuenta. Por favor, inténtalo de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

return (
  <div className={styles.container}>
    <Formik
      initialValues={initialValues}
      validationSchema={validateUser}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className={styles.form}>
          <h1>Crear cuenta</h1>
          <div>
            <Field
              type="text"
              id="firstName"
              name="firstName"
              className={styles.field}
              placeholder="Nombre"
              maxLength={25}
            />
            <br />
            <p className={styles.error}><ErrorMessage name="firstName" /></p>
          </div>

          <div>
            <Field
              type="text"
              id="lastName"
              name="lastName"
              className={styles.field}
              placeholder="Apellido"
              maxLength={25}
            />
            <br />
            <p className={styles.error}><ErrorMessage name="lastName" /></p>
          </div>

          <div>
            <Field
              type="email"
              id="email"
              name="email"
              className={styles.field}
              placeholder="Email"
              maxLength={40}
            />
            <br />
            <p className={styles.error}><ErrorMessage name="email" /></p>
          </div>

          <div>
            <Field
              type="password"
              id="password"
              name="password"
              className={styles.field}
              placeholder="Contraseña"
              maxLength={16}
            />
            <br />
            <p className={styles.error}><ErrorMessage name="password" /></p>
          </div>

          <div>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.field}
              placeholder="Confirma contraseña"
              maxLength={16}
            />
            <br />
            <p className={styles.error}><ErrorMessage name="confirmPassword" /></p>
          </div>

          <div>
          <label htmlFor="profilePicture">Foto de perfil: (formatos en .jpg, .jpeg ó .png)</label>
              <br />
              <input
                className={styles.field}
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
              />
              <br />
            <p className={styles.error}><ErrorMessage name="profilePicture" /></p>
          </div>

          <div>
            <Field
              type="text"
              id="country"
              name="country"
              className={styles.field}
              placeholder="País"
              maxLength={25}
            />
            <br />
            <p className={styles.error}><ErrorMessage name="country" /></p>
          </div>

          <div>
            <Field
              type="text"
              id="city"
              name="city"
              className={styles.field}
              placeholder="Ciudad"
              maxLength={25}
            />
            <br />
            <p className={styles.error}><ErrorMessage name="city" /></p>
          </div>

          <div>
            <Field
              type="text"
              id="address"
              name="address"
              className={styles.field}
              placeholder="Direccion"
              maxLength={25}
            />
            <br />
            <p className={styles.error}><ErrorMessage name="address" /></p>
          </div>

          <button type="submit" className={styles.send} disabled={!isValid || !dirty || isSubmitting}>
            {isSubmitting ? <Loading /> : 'REGISTRARME'}
          </button>
        </Form>
        
      )}
    </Formik>
  </div>
);
}

export default UserForm;