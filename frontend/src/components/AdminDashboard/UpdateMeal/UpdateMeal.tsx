import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './UpdateMeal.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { upgradeMeal, getFood, imageUpload } from '../../../redux/actions/Actions';
import { useParams } from 'react-router-dom';
import { StoreState } from '../../../redux/reducer/Reducer';
import Error404 from '../../Error/error';
import Swal from 'sweetalert2';



interface PropsCreateMeal {
  id: number;
  nombre: string;
  origen: string;
  ingredientes: string[];
  kilocalorias: number,
  carbohidratos: number;
  grasas: number;
  peso: number;
  precio: number;
  tipo: string;
  imagen: string | null;
  descripcion: string;
  stock: string;
  ingrediente: string;
  inventario: number;
}

const initialValues: PropsCreateMeal = {
  id: 0,
  nombre: '',
  origen: '',
  ingredientes: [],
  kilocalorias: 0, 
  carbohidratos: 0,
  grasas: 0,
  peso: 0,
  precio: 0,
  tipo: '',
  imagen: null,
  descripcion: '',
  stock: 'Disponible',
  ingrediente: '',
  inventario: 0,
};
interface UpdateMealProps {
  setChanges: Dispatch<SetStateAction<boolean>>;
}

const UpdateMeal: React.FC<UpdateMealProps> = () => {
  const [initialValuesData, setInitialValuesData] = useState<PropsCreateMeal>(initialValues);
  const [profilePictureUrl, setProfilePictureUrl] = useState<File | undefined>(undefined);
  const [idComida, setIdComida] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false)
  const foodState = useSelector((state: StoreState) => state.platos);
  const isAdmin = useSelector((state: StoreState) => state.admin)
  const dispatch = useDispatch();
  const { id } = useParams();


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];
    await setProfilePictureUrl(selectedFile);
  };

  useEffect(() => {
    if (id !== undefined) {
      setIdComida(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (idComida !== undefined) {
      const selectedItem = foodState.find(item => item.id === idComida);
      if (selectedItem) {
        setInitialValuesData({
          id: selectedItem.id,
          nombre: selectedItem.nombre,
          origen: selectedItem.origen,
          ingredientes: selectedItem.ingredientes,
          kilocalorias: selectedItem.kilocalorias,
          carbohidratos: selectedItem.carbohidratos,
          grasas: selectedItem.grasas,
          peso: selectedItem.peso,
          precio: selectedItem.precio,
          tipo: selectedItem.tipo,
          imagen: null,
          descripcion: selectedItem.descripcion,
          stock: 'Disponible',
          ingrediente: '',
          inventario: selectedItem.inventario,
        });
        setLoading(true)
      }
    }
  }, [idComida, foodState]);
  

  const handleSubmit = async (values: PropsCreateMeal) => {
    try {
      console.log('Valor de inventario antes de enviar el formulario:', values.inventario);
      if(idComida){
        await submit(
          dispatch,
          idComida,
          values.nombre,
          values.origen,
          values.ingredientes,
          values.kilocalorias,
          values.carbohidratos,
          values.grasas,
          values.peso,
          values.precio,
          values.tipo,
          values.imagen,
          values.descripcion,
          values.stock,
          values.inventario
        );
      }
      Swal.fire({
        title: 'Plato actualizado',
        text: 'Se actualizo el plato correctamente',
        icon: 'success',
        confirmButtonText: 'Entendido'
      })
      .then(() => {
        window.location.href = "/admindashboard/editar-eliminar";
      })
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: '¡Hubo un error al actualizar el plato!',
        icon: 'error',
        confirmButtonText: 'Entendido'
      })
      console.error(error);
    }
  };

  const submit = async (
    dispatch: any,         
    id: number,
    nombre: string,
    origen: string,
    ingredientes: string[],
    kilocalorias: number,
    carbohidratos: number,
    grasas: number,
    peso: number,
    precio: number,
    tipo: string,
    imagen: string | null,
    descripcion: string,
    stock: string,
    inventario: number,
    ) => {
    try {
      let urlImage: string | null = null;
      if (profilePictureUrl !== undefined) {
          urlImage = await imageUpload(profilePictureUrl);
      }
      imagen = urlImage
      await dispatch(upgradeMeal(
        id,
        nombre,
        origen,
        ingredientes,
        kilocalorias,
        carbohidratos,
        grasas,
        peso,
        precio,
        tipo,
        imagen,
        descripcion,
        stock,
        inventario,
      ));

      
      await dispatch(getFood())
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {isAdmin === false ? (
        <Error404 />
      ) : (
        <>{loading ? (
          <Formik
            initialValues={initialValuesData}
            onSubmit={handleSubmit}
          >
      {({ values, setFieldValue, isValid, dirty }) => (
        <Form>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        
          <div className={styles.container}>
            <div className={styles.formContainerL}>
              <label htmlFor='nombre' className={styles.label}>
                Nombre del plato*:
              </label>
              <Field
                placeholder='Nombre del plato'
                type='text'
                name='nombre'
                className={styles.inputField}
                defaultValue='Valor predeterminado'
                maxLength={50} 
              />
              <p className={styles.error}>
                <ErrorMessage name='nombre' />
              </p>

              <label htmlFor='origen' className={styles.label}>
                País del plato*:
              </label>
              <Field as="select" name="origen" className={styles.inputField}>
           <option value="">Selecciona un país</option>
           <option value="Argentina">Argentina</option>
           <option value="Mexico">México</option>
           <option value="Colombia">Colombia</option>
           <option value="Ecuador">Ecuador</option>
           </Field>
              <p className={styles.error}>
                <ErrorMessage name='origen' />
              </p>
              <label htmlFor='inventario' className={styles.label}>
            Inventario*:
          </label>
          <Field
          maxLength={50} 
            placeholder='Inventario'
            type='number'
            name='inventario'
            className={styles.inputField}
            min={0} // Agrega esta línea para permitir que el valor sea cero
          />
          <p className={styles.error}>
            <ErrorMessage name='inventario' />
          </p>

              <div>
              <label htmlFor='ingredientes' className={styles.label}>Ingredientes*:</label>
                <br />
                <Field placeholder='ingredientes' name='ingrediente' className={styles.inputField} />
                <button
                  type='button'

                  className={styles.addButton}
                  onClick={() => {
                    const newIngredient = values.ingrediente.trim();
                    if (typeof newIngredient === 'string' && newIngredient !== '' && !values.ingredientes.includes(newIngredient)) {
                      setFieldValue('ingredientes', [...values.ingredientes, newIngredient]);
                      setFieldValue('ingrediente', '');
                    }
                  }}
                >
                  AGREGAR
                </button>
              </div>
              <ErrorMessage name='ingredientes' component='div' className={styles.error} />
                
              {values.ingredientes.length > 0 && (
                <ul className={styles.ingredientList}>
                  {values.ingredientes.map((ingrediente, index) => (
                    <li key={index} className={styles.ingredientListItem}>
                      {ingrediente}
                      <button
                        type='button'
                        className={styles.deleteButton}
                        onClick={() => {
                          const newIngredients = values.ingredientes.filter((_, i) => i !== index);
                          setFieldValue('ingredientes', newIngredients);
                        }}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <label htmlFor='kilocalorias' className={styles.label}>
                Kilocalorias*:
              </label>
              <Field
                placeholder='Kilocalorias'
                type='number'
                name='kilocalorias'
                className={styles.inputField}
                min={0}
              />
              <p className={styles.error}>
                <ErrorMessage name='kilocalorias' />
              </p>

              <label htmlFor='carbohidratos' className={styles.label}>
                Carbohidratos (gr)*:
              </label>
              <Field
                placeholder='Carbohidratos'
                type='number'
                name='carbohidratos'
                className={styles.inputField}
                min={0}
              />
              <p className={styles.error}>
                <ErrorMessage name='carbohidratos' />
              </p>

              <label htmlFor='grasas' className={styles.label}>
                Grasas (gr)*:
              </label>
              <Field
                placeholder='Grasas'
                type='number'
                name='grasas'
                className={styles.inputField}
                min={0}
              />
              <p className={styles.error}>
                <ErrorMessage name='grasas' />
              </p>
            </div>
            <div className={styles.formContainerR}>
              <label htmlFor='peso' className={styles.label}>
                Peso (gr)*:
              </label>
              <Field
                placeholder='Peso'
                type='number'
                name='peso'
                className={styles.inputField}
                min={0}
              />
              <p className={styles.error}>
                <ErrorMessage name='peso' />
              </p>

              <label htmlFor='precio' className={styles.label}>
                Precio (USD)*:
              </label>
              <Field
                placeholder='Precio'
                type='number'
                name='precio'
                className={styles.inputField}
                min={0}
              />
              <p className={styles.error}>
                <ErrorMessage name='precio' />
              </p>

              <label htmlFor='tipo' className={styles.label}>
                Tipo*:
              </label>
              <Field
                as='select'
                id='tipo'
                name='tipo'
                className={styles.inputField}
              >
                <option value=''>Seleccione un tipo</option>
                <option value='plato fuerte'>Plato fuerte</option>
                <option value='vegano'>Vegano</option>
                <option value='postre'>Postre</option>
              </Field>
              <p className={styles.error}>
                <ErrorMessage name='tipo' />
              </p>

              <label htmlFor='image' className={styles.label}>
                Foto del plato*: (formatos en .jpg, .jpeg ó .png)
              </label>
              <br />
              <input
                className={styles.inputField}
                type='file'
                id='imagen'
                name='imagen'
                accept='image/png, image/jpeg, image/jpg'
                onChange={(event) => {
                  setFieldValue('image', event.currentTarget.files?.[0]);
                  handleFileChange(event);
                }}
              />
              <p className={styles.error}>
                <ErrorMessage name='image' />
              </p>

              <label htmlFor='descripcion' className={styles.label}>
                Decripción*:
              </label>
              <Field
                placeholder='Descripcion'
                as='textarea'
                name='descripcion'
                className={styles.textArea}
                maxLength={1000}  
              />
              <p className={styles.error}>
                <ErrorMessage name='descripcion' />
              </p>

              <button
                type='submit'
                className={styles.submitButton}
                disabled={!isValid || !dirty}
              >
                Actualizar
              </button>
            </div>
          </div>
        </Form>
      )}
        </Formik>
        ) : null}</>
      )}
    </>
  );
};

export default UpdateMeal;