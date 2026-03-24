import React from 'react';
import CardBox from '../CardBox';
import ImageField from '../ImageField';
import dataFormatter from '../../helpers/dataFormatter';
import {saveFile} from "../../helpers/fileSaver";
import ListActionsPopover from "../ListActionsPopover";
import {useAppSelector} from "../../stores/hooks";
import {Pagination} from "../Pagination";
import LoadingSpinner from "../LoadingSpinner";
import Link from 'next/link';

import {hasPermission} from "../../helpers/userPermissions";


type Props = {
    tasks: any[];
    loading: boolean;
    onDelete: (id: string) => void;
    currentPage: number;
    numPages: number;
    onPageChange: (page: number) => void;
};

const ListTasks = ({ tasks, loading, onDelete, currentPage, numPages, onPageChange }: Props) => {
    
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const hasUpdatePermission = hasPermission(currentUser, 'UPDATE_TASKS')
    
    const corners = useAppSelector((state) => state.style.corners);
    const bgColor = useAppSelector((state) => state.style.cardsColor);


    return (
        <>
            <div className='relative overflow-x-auto p-4 space-y-4'>
                {loading && <LoadingSpinner />}
                {!loading && tasks.map((item) => (
                  <div key={item.id}>
                    <CardBox hasTable isList className={'rounded shadow-none'}>
                        <div className={`flex rounded  dark:bg-dark-900  border  border-stone-300  items-center overflow-hidden`}>
                          
                          <Link
                              href={`/tasks/tasks-view/?id=${item.id}`}
                              className={
                                  'flex-1 px-4 py-6 h-24 flex divide-x-2  divide-stone-300   items-center overflow-hidden`}> dark:divide-dark-700 overflow-x-auto'
                              }
                          >
                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Organization</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.organizationsOneListFormatter(item.organization) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Case</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.casesOneListFormatter(item.case) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Assignee</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.usersOneListFormatter(item.assignee_user) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Title</p>
                                <p className={'line-clamp-2'}>{ item.title }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Description</p>
                                <p className={'line-clamp-2'}>{ item.description }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Status</p>
                                <p className={'line-clamp-2'}>{ item.status }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Priority</p>
                                <p className={'line-clamp-2'}>{ item.priority }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>DueAt</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.dateTimeFormatter(item.due_at) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>CompletedAt</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.dateTimeFormatter(item.completed_at) }</p>
                            </div>
                          

                          
                          </Link>
                            <ListActionsPopover
                              onDelete={onDelete}
                              itemId={item.id}
                              pathEdit={`/tasks/tasks-edit/?id=${item.id}`}
                              pathView={`/tasks/tasks-view/?id=${item.id}`}
                              
                              hasUpdatePermission={hasUpdatePermission}
                              
                            />
                        </div>
                    </CardBox>
                  </div>
                ))}
                {!loading && tasks.length === 0 && (
                  <div className='col-span-full flex items-center justify-center h-40'>
                      <p className=''>No records yet</p>
                  </div>
                )}
            </div>
            <div className={'flex items-center justify-center my-6'}>
                <Pagination
                  currentPage={currentPage}
                  numPages={numPages}
                  setCurrentPage={onPageChange}
                />
            </div>
        </>
    )
};

export default ListTasks