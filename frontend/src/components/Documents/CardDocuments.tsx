import React from 'react';
import ImageField from '../ImageField';
import ListActionsPopover from '../ListActionsPopover';
import { useAppSelector } from '../../stores/hooks';
import dataFormatter from '../../helpers/dataFormatter';
import { Pagination } from '../Pagination';
import {saveFile} from "../../helpers/fileSaver";
import LoadingSpinner from "../LoadingSpinner";
import Link from 'next/link';

import {hasPermission} from "../../helpers/userPermissions";


type Props = {
  documents: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
};

const CardDocuments = ({
  documents,
  loading,
  onDelete,
  currentPage,
  numPages,
  onPageChange,
}: Props) => {
    const asideScrollbarsStyle = useAppSelector(
        (state) => state.style.asideScrollbarsStyle,
    );
    const bgColor = useAppSelector((state) => state.style.cardsColor);
    const darkMode = useAppSelector((state) => state.style.darkMode);
    const corners = useAppSelector((state) => state.style.corners);
    const focusRing = useAppSelector((state) => state.style.focusRingColor);
    
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const hasUpdatePermission = hasPermission(currentUser, 'UPDATE_DOCUMENTS')
    

  return (
    <div className={'p-4'}>
      {loading && <LoadingSpinner />}
      <ul
        role='list'
        className='grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 2xl:grid-cols-4 xl:gap-x-8'
      >
        {!loading && documents.map((item, index) => (
          <li
            key={item.id}
            className={`overflow-hidden ${corners !== 'rounded-full'? corners : 'rounded-3xl'} border  ${focusRing} border-gray-200 dark:border-dark-700 ${
                darkMode ? 'aside-scrollbars-[slate]' : asideScrollbarsStyle
            }`}
          >
            
            <div className={`flex items-center ${bgColor} p-6  gap-x-4 border-b border-gray-900/5 bg-gray-50 dark:bg-dark-800 relative`}>
                
                <Link href={`/documents/documents-view/?id=${item.id}`} className='text-lg font-bold leading-6 line-clamp-1'>
                    {item.title}
                </Link>
              

              <div className='ml-auto '>
                <ListActionsPopover
                  onDelete={onDelete}
                  itemId={item.id}
                  pathEdit={`/documents/documents-edit/?id=${item.id}`}
                  pathView={`/documents/documents-view/?id=${item.id}`}
                  
                  hasUpdatePermission={hasUpdatePermission}
                  
                />
              </div>
            </div>
            <dl className='divide-y  divide-stone-300   dark:divide-dark-700 px-6 py-4 text-sm leading-6 h-64 overflow-y-auto'>
              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>Organization</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium line-clamp-4'>
                            { dataFormatter.organizationsOneListFormatter(item.organization) }
                        </div>
                    </dd>
                </div>
              

              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>Case</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium line-clamp-4'>
                            { dataFormatter.casesOneListFormatter(item.case) }
                        </div>
                    </dd>
                </div>
              

              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>UploadedBy</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium line-clamp-4'>
                            { dataFormatter.usersOneListFormatter(item.uploaded_by_user) }
                        </div>
                    </dd>
                </div>
              

              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>Category</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium line-clamp-4'>
                            { item.category }
                        </div>
                    </dd>
                </div>
              

              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>Title</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium line-clamp-4'>
                            { item.title }
                        </div>
                    </dd>
                </div>
              

              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>Description</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium line-clamp-4'>
                            { item.description }
                        </div>
                    </dd>
                </div>
              

              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>File</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium'>
                            {dataFormatter.filesFormatter(item.file).map(link => (
                                <button
                                    key={link.publicUrl}
                                    onClick={(e) => saveFile(e, link.publicUrl, link.name)}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>
                    </dd>
                </div>
              

              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>IsConfidential</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium line-clamp-4'>
                            { dataFormatter.booleanFormatter(item.is_confidential) }
                        </div>
                    </dd>
                </div>
              

              
              
                <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='  text-gray-500  dark:text-dark-600'>ReceivedAt</dt>
                    <dd className='flex items-start gap-x-2'>
                        <div className='font-medium line-clamp-4'>
                            { dataFormatter.dateTimeFormatter(item.received_at) }
                        </div>
                    </dd>
                </div>
              

              
            </dl>
          </li>
        ))}
        {!loading && documents.length === 0 && (
          <div className='col-span-full flex items-center justify-center h-40'>
            <p className=''>No records yet</p>
          </div>
        )}
      </ul>
      <div className={'flex items-center justify-center my-6'}>
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          setCurrentPage={onPageChange}
        />
      </div>
    </div>
  );
};

export default CardDocuments;
