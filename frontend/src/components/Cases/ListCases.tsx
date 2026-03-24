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
    cases: any[];
    loading: boolean;
    onDelete: (id: string) => void;
    currentPage: number;
    numPages: number;
    onPageChange: (page: number) => void;
};

const ListCases = ({ cases, loading, onDelete, currentPage, numPages, onPageChange }: Props) => {
    
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const hasUpdatePermission = hasPermission(currentUser, 'UPDATE_CASES')
    
    const corners = useAppSelector((state) => state.style.corners);
    const bgColor = useAppSelector((state) => state.style.cardsColor);


    return (
        <>
            <div className='relative overflow-x-auto p-4 space-y-4'>
                {loading && <LoadingSpinner />}
                {!loading && cases.map((item) => (
                  <div key={item.id}>
                    <CardBox hasTable isList className={'rounded shadow-none'}>
                        <div className={`flex rounded  dark:bg-dark-900  border  border-stone-300  items-center overflow-hidden`}>
                          
                          <Link
                              href={`/cases/cases-view/?id=${item.id}`}
                              className={
                                  'flex-1 px-4 py-6 h-24 flex divide-x-2  divide-stone-300   items-center overflow-hidden`}> dark:divide-dark-700 overflow-x-auto'
                              }
                          >
                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Organization</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.organizationsOneListFormatter(item.organization) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Payer</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.payersOneListFormatter(item.payer) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Owner</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.usersOneListFormatter(item.owner_user) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>CaseNumber</p>
                                <p className={'line-clamp-2'}>{ item.case_number }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>PatientName</p>
                                <p className={'line-clamp-2'}>{ item.patient_name }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>PatientDateofBirth</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.dateTimeFormatter(item.patient_dob) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>MemberID</p>
                                <p className={'line-clamp-2'}>{ item.member_id }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>ProcedureCode</p>
                                <p className={'line-clamp-2'}>{ item.procedure_code }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>DiagnosisCode</p>
                                <p className={'line-clamp-2'}>{ item.diagnosis_code }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>DenialReasonCode</p>
                                <p className={'line-clamp-2'}>{ item.denial_reason_code }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>DenialReason</p>
                                <p className={'line-clamp-2'}>{ item.denial_reason }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>FacilityName</p>
                                <p className={'line-clamp-2'}>{ item.facility_name }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>OrderingProvider</p>
                                <p className={'line-clamp-2'}>{ item.ordering_provider }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>AmountatRisk</p>
                                <p className={'line-clamp-2'}>{ item.amount_at_risk }</p>
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
                                <p className={'text-xs   text-gray-500 '}>SubmittedAt</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.dateTimeFormatter(item.submitted_at) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>DueAt</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.dateTimeFormatter(item.due_at) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>ClosedAt</p>
                                <p className={'line-clamp-2'}>{ dataFormatter.dateTimeFormatter(item.closed_at) }</p>
                            </div>
                          

                          
                          
                            <div className={'flex-1 px-3'}>
                                <p className={'text-xs   text-gray-500 '}>Outcome</p>
                                <p className={'line-clamp-2'}>{ item.outcome }</p>
                            </div>
                          

                          
                          </Link>
                            <ListActionsPopover
                              onDelete={onDelete}
                              itemId={item.id}
                              pathEdit={`/cases/cases-edit/?id=${item.id}`}
                              pathView={`/cases/cases-view/?id=${item.id}`}
                              
                              hasUpdatePermission={hasUpdatePermission}
                              
                            />
                        </div>
                    </CardBox>
                  </div>
                ))}
                {!loading && cases.length === 0 && (
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

export default ListCases