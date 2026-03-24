import React from 'react';
import BaseIcon from '../BaseIcon';
import { mdiEye, mdiTrashCan, mdiPencilOutline } from '@mdi/js';
import axios from 'axios';
import {
    GridActionsCellItem,
    GridRowParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import ImageField from '../ImageField';
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter'
import DataGridMultiSelect from "../DataGridMultiSelect";
import ListActionsPopover from '../ListActionsPopover';

import {hasPermission} from "../../helpers/userPermissions";

type Params = (id: string) => void;

export const loadColumns = async (
    onDelete: Params,
    entityName: string,
    
    user
    
) => {
    async function callOptionsApi(entityName: string) {
        
        if (!hasPermission(user, 'READ_' + entityName.toUpperCase())) return [];
        
        try {
        const data = await axios(`/${entityName}/autocomplete?limit=100`);
        return data.data;
        } catch (error) {
         console.log(error);
         return [];
        }
    }
    
    const hasUpdatePermission = hasPermission(user, 'UPDATE_CASES')
    
    return [
        
        {
            field: 'organization',
            headerName: 'Organization',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            sortable: false,
            type: 'singleSelect',
            getOptionValue: (value: any) => value?.id,
            getOptionLabel: (value: any) => value?.label,
            valueOptions: await callOptionsApi('organizations'),
            valueGetter: (params: GridValueGetterParams) =>
                params?.value?.id ?? params?.value,
          
        },
        
        {
            field: 'payer',
            headerName: 'Payer',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            sortable: false,
            type: 'singleSelect',
            getOptionValue: (value: any) => value?.id,
            getOptionLabel: (value: any) => value?.label,
            valueOptions: await callOptionsApi('payers'),
            valueGetter: (params: GridValueGetterParams) =>
                params?.value?.id ?? params?.value,
          
        },
        
        {
            field: 'owner_user',
            headerName: 'Owner',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            sortable: false,
            type: 'singleSelect',
            getOptionValue: (value: any) => value?.id,
            getOptionLabel: (value: any) => value?.label,
            valueOptions: await callOptionsApi('users'),
            valueGetter: (params: GridValueGetterParams) =>
                params?.value?.id ?? params?.value,
          
        },
        
        {
            field: 'case_number',
            headerName: 'CaseNumber',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'patient_name',
            headerName: 'PatientName',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'patient_dob',
            headerName: 'PatientDateofBirth',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            type: 'dateTime',
            valueGetter: (params: GridValueGetterParams) =>
                new Date(params.row.patient_dob),
          
        },
        
        {
            field: 'member_id',
            headerName: 'MemberID',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'procedure_code',
            headerName: 'ProcedureCode',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'diagnosis_code',
            headerName: 'DiagnosisCode',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'denial_reason_code',
            headerName: 'DenialReasonCode',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'denial_reason',
            headerName: 'DenialReason',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'facility_name',
            headerName: 'FacilityName',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'ordering_provider',
            headerName: 'OrderingProvider',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'amount_at_risk',
            headerName: 'AmountatRisk',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            type: 'number',
          
        },
        
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'priority',
            headerName: 'Priority',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'submitted_at',
            headerName: 'SubmittedAt',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            type: 'dateTime',
            valueGetter: (params: GridValueGetterParams) =>
                new Date(params.row.submitted_at),
          
        },
        
        {
            field: 'due_at',
            headerName: 'DueAt',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            type: 'dateTime',
            valueGetter: (params: GridValueGetterParams) =>
                new Date(params.row.due_at),
          
        },
        
        {
            field: 'closed_at',
            headerName: 'ClosedAt',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            type: 'dateTime',
            valueGetter: (params: GridValueGetterParams) =>
                new Date(params.row.closed_at),
          
        },
        
        {
            field: 'outcome',
            headerName: 'Outcome',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'actions',
            type: 'actions',
            minWidth: 30,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
            getActions: (params: GridRowParams) => {
                
               return [
                   <div key={params?.row?.id}>
                      <ListActionsPopover
                      onDelete={onDelete}
                      itemId={params?.row?.id}
                      pathEdit={`/cases/cases-edit/?id=${params?.row?.id}`}
                      pathView={`/cases/cases-view/?id=${params?.row?.id}`}
                      
                      hasUpdatePermission={hasUpdatePermission}
                      
                    />
                   </div>,
                  ]
            },
        },
    ];
};
