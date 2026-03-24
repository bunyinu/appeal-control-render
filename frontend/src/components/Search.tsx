import React from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useAppSelector } from '../stores/hooks';

const Search = () => {
  const router = useRouter();
  const currentQuery = typeof router.query.query === 'string' ? router.query.query : '';
  const focusRing = useAppSelector((state) => state.style.focusRingColor);
  const corners = useAppSelector((state) => state.style.corners);
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);
  const validateSearch = (value) => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (value.length < 2) {
      error = 'Minimum length: 2 characters';
    }
    return error;
  };
  return (
    <Formik
      initialValues={{
        search: currentQuery,
      }}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        const nextQuery = values.search.trim();

        if (nextQuery.length >= 2) {
          router.push(`/search?query=${encodeURIComponent(nextQuery)}`);
        }

        setSubmitting(false);
      }}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ errors, touched, values }) => (
          <Form style={{ width: '320px' }}>
          <Field
            id='search'
            name='search'
            validate={validateSearch}
            placeholder='Search cases, tasks, notes...'
            className={` ${corners} dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-2 relative ml-2 w-full dark:placeholder-dark-600 ${focusRing} shadow-none`}
          />
          {errors.search && touched.search && values.search.length < 2 ? (
            <div className='text-red-500 text-sm ml-2 absolute'>{errors.search}</div>
          ) : null}
        </Form>
      )}
    </Formik>
  );
};
export default Search;
