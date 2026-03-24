





















const db = require('../models');
const Users = db.users;






const Organizations = db.organizations;

const Payers = db.payers;

const Cases = db.cases;

const Tasks = db.tasks;

const Documents = db.documents;

const AppealDrafts = db.appeal_drafts;

const Notes = db.notes;

const ActivityLogs = db.activity_logs;

const Settings = db.settings;







const OrganizationsData = [
    
    {
    
        
        
            
                "name": "North Valley Oncology Group",
            
        
    
    },
    
    {
    
        
        
            
                "name": "Lakeside Cancer Center",
            
        
    
    },
    
    {
    
        
        
            
                "name": "Sunrise Radiation Partners",
            
        
    
    },
    
    {
    
        
        
            
                "name": "Cedar Ridge Oncology",
            
        
    
    },
    
    {
    
        
        
            
                "name": "Metro Precision Oncology",
            
        
    
    },
    
];



const PayersData = [
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "name": "BlueShield of Illinois",
            
        
    
        
        
            
                "payer_code": "BSIL",
            
        
    
        
        
            
                "plan_type": "Commercial PPO",
            
        
    
        
        
            
                "claims_address": "P O Box 12345 Chicago IL 60601",
            
        
    
        
        
            
                "fax_number": "312-555-2001",
            
        
    
        
        
            
                "portal_url": "https://portal.blueshield-il.example",
            
        
    
        
        
            
                "appeals_submission_method": "Portal",
            
        
    
        
        
            
                "appeals_contact": "Appeals Unit Phone 312-555-4455 Reference Fax 312-555-2001",
            
        
    
        
        
            
                "is_active": true,
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "name": "UnitedCare Midwest",
            
        
    
        
        
            
                "payer_code": "UCMW",
            
        
    
        
        
            
                "plan_type": "Commercial HMO",
            
        
    
        
        
            
                "claims_address": "P O Box 67890 Chicago IL 60602",
            
        
    
        
        
            
                "fax_number": "312-555-2002",
            
        
    
        
        
            
                "portal_url": "https://connect.unitedcare-midwest.example",
            
        
    
        
        
            
                "appeals_submission_method": "Fax",
            
        
    
        
        
            
                "appeals_contact": "Appeals Phone 312-555-4466 Fax 312-555-2002",
            
        
    
        
        
            
                "is_active": true,
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "name": "Aetna Regional",
            
        
    
        
        
            
                "payer_code": "AETR",
            
        
    
        
        
            
                "plan_type": "Commercial PPO",
            
        
    
        
        
            
                "claims_address": "P O Box 24680 Hartford CT 06103",
            
        
    
        
        
            
                "fax_number": "860-555-2003",
            
        
    
        
        
            
                "portal_url": "https://aetna-regional.example",
            
        
    
        
        
            
                "appeals_submission_method": "Mail",
            
        
    
        
        
            
                "appeals_contact": "Appeals Mailstop 12 Phone 860-555-4477",
            
        
    
        
        
            
                "is_active": true,
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "name": "Humana Advantage",
            
        
    
        
        
            
                "payer_code": "HADV",
            
        
    
        
        
            
                "plan_type": "Medicare Advantage",
            
        
    
        
        
            
                "claims_address": "P O Box 13579 Louisville KY 40202",
            
        
    
        
        
            
                "fax_number": "502-555-2004",
            
        
    
        
        
            
                "portal_url": "https://humana-advantage.example",
            
        
    
        
        
            
                "appeals_submission_method": "Portal",
            
        
    
        
        
            
                "appeals_contact": "MA Appeals Phone 502-555-4488",
            
        
    
        
        
            
                "is_active": true,
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "name": "Medicaid Illinois",
            
        
    
        
        
            
                "payer_code": "ILMD",
            
        
    
        
        
            
                "plan_type": "Medicaid",
            
        
    
        
        
            
                "claims_address": "401 S Clinton St Chicago IL 60607",
            
        
    
        
        
            
                "fax_number": "312-555-2005",
            
        
    
        
        
            
                "portal_url": "https://medicaid.illinois.example",
            
        
    
        
        
            
                "appeals_submission_method": "Mail",
            
        
    
        
        
            
                "appeals_contact": "Provider Appeals Phone 312-555-4499",
            
        
    
        
        
            
                "is_active": true,
            
        
    
    },
    
];



const CasesData = [
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "case_number": "AC-2026-0001",
            
        
    
        
        
            
                "patient_name": "Evelyn Harper",
            
        
    
        
        
            
                "patient_dob": new Date('1968-11-22T00:00:00Z'),
            
        
    
        
        
            
                "member_id": "BSIL-8821945",
            
        
    
        
        
            
                "procedure_code": "77427",
            
        
    
        
        
            
                "diagnosis_code": "C34.90",
            
        
    
        
        
            
                "denial_reason_code": "DR-PA-001",
            
        
    
        
        
            
                "denial_reason": "Prior authorization not obtained before start of treatment",
            
        
    
        
        
            
                "facility_name": "North Valley Cancer Center",
            
        
    
        
        
            
                "ordering_provider": "Dr Samuel Ortiz",
            
        
    
        
        
            
                "amount_at_risk": 8420.5,
            
        
    
        
        
            
                "status": "won",
            
        
    
        
        
            
                "priority": "high",
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-10T14:30:00Z'),
            
        
    
        
        
            
                "due_at": new Date('2026-03-28T23:59:00Z'),
            
        
    
        
        
            
                "closed_at": new Date('2026-04-05T17:05:00Z'),
            
        
    
        
        
            
                "outcome": "won",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "case_number": "AC-2026-0002",
            
        
    
        
        
            
                "patient_name": "Michael Bennett",
            
        
    
        
        
            
                "patient_dob": new Date('1959-04-09T00:00:00Z'),
            
        
    
        
        
            
                "member_id": "UCMW-7712031",
            
        
    
        
        
            
                "procedure_code": "77263",
            
        
    
        
        
            
                "diagnosis_code": "C61",
            
        
    
        
        
            
                "denial_reason_code": "DR-MN-014",
            
        
    
        
        
            
                "denial_reason": "Medical necessity criteria not met per policy",
            
        
    
        
        
            
                "facility_name": "North Valley Cancer Center",
            
        
    
        
        
            
                "ordering_provider": "Dr Priya Desai",
            
        
    
        
        
            
                "amount_at_risk": 12650,
            
        
    
        
        
            
                "status": "appeal_ready",
            
        
    
        
        
            
                "priority": "low",
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-15T09:10:00Z'),
            
        
    
        
        
            
                "due_at": new Date('2026-03-24T23:59:00Z'),
            
        
    
        
        
            
                "closed_at": new Date('2026-03-29T12:00:00Z'),
            
        
    
        
        
            
                "outcome": "lost",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "case_number": "AC-2026-0003",
            
        
    
        
        
            
                "patient_name": "Sophia Clarke",
            
        
    
        
        
            
                "patient_dob": new Date('1974-07-16T00:00:00Z'),
            
        
    
        
        
            
                "member_id": "AETR-6605199",
            
        
    
        
        
            
                "procedure_code": "77301",
            
        
    
        
        
            
                "diagnosis_code": "C50.919",
            
        
    
        
        
            
                "denial_reason_code": "DR-DOC-007",
            
        
    
        
        
            
                "denial_reason": "Insufficient supporting documentation attached to claim",
            
        
    
        
        
            
                "facility_name": "North Valley Outpatient Center",
            
        
    
        
        
            
                "ordering_provider": "Dr Hannah Lee",
            
        
    
        
        
            
                "amount_at_risk": 5320,
            
        
    
        
        
            
                "status": "appeal_ready",
            
        
    
        
        
            
                "priority": "urgent",
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-12T11:45:00Z'),
            
        
    
        
        
            
                "due_at": new Date('2026-03-30T23:59:00Z'),
            
        
    
        
        
            
                "closed_at": new Date('2026-04-02T10:30:00Z'),
            
        
    
        
        
            
                "outcome": "partially_won",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "case_number": "AC-2026-0004",
            
        
    
        
        
            
                "patient_name": "Daniel Flores",
            
        
    
        
        
            
                "patient_dob": new Date('1948-02-03T00:00:00Z'),
            
        
    
        
        
            
                "member_id": "HADV-9401120",
            
        
    
        
        
            
                "procedure_code": "77412",
            
        
    
        
        
            
                "diagnosis_code": "C79.51",
            
        
    
        
        
            
                "denial_reason_code": "DR-LCD-022",
            
        
    
        
        
            
                "denial_reason": "Coverage policy limitation for fractionation schedule",
            
        
    
        
        
            
                "facility_name": "North Valley Cancer Center",
            
        
    
        
        
            
                "ordering_provider": "Dr Samuel Ortiz",
            
        
    
        
        
            
                "amount_at_risk": 9150.75,
            
        
    
        
        
            
                "status": "submitted",
            
        
    
        
        
            
                "priority": "low",
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-05T16:20:00Z'),
            
        
    
        
        
            
                "due_at": new Date('2026-03-20T23:59:00Z'),
            
        
    
        
        
            
                "closed_at": new Date('2026-04-10T14:00:00Z'),
            
        
    
        
        
            
                "outcome": "unknown",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "case_number": "AC-2026-0005",
            
        
    
        
        
            
                "patient_name": "Olivia Garcia",
            
        
    
        
        
            
                "patient_dob": new Date('1982-09-28T00:00:00Z'),
            
        
    
        
        
            
                "member_id": "ILMD-5033882",
            
        
    
        
        
            
                "procedure_code": "77290",
            
        
    
        
        
            
                "diagnosis_code": "C53.9",
            
        
    
        
        
            
                "denial_reason_code": "DR-ELG-003",
            
        
    
        
        
            
                "denial_reason": "Member eligibility not active on date of service",
            
        
    
        
        
            
                "facility_name": "North Valley Outpatient Center",
            
        
    
        
        
            
                "ordering_provider": "Dr Priya Desai",
            
        
    
        
        
            
                "amount_at_risk": 2875,
            
        
    
        
        
            
                "status": "evidence_needed",
            
        
    
        
        
            
                "priority": "low",
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-20T08:05:00Z'),
            
        
    
        
        
            
                "due_at": new Date('2026-04-05T23:59:00Z'),
            
        
    
        
        
            
                "closed_at": new Date('2026-04-18T09:20:00Z'),
            
        
    
        
        
            
                "outcome": "unknown",
            
        
    
    },
    
];



const TasksData = [
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Request prior authorization history",
            
        
    
        
        
            
                "description": "Confirm if retro authorization can be requested and collect any payer correspondence",
            
        
    
        
        
            
                "status": "in_progress",
            
        
    
        
        
            
                "priority": "medium",
            
        
    
        
        
            
                "due_at": new Date('2026-03-22T23:59:00Z'),
            
        
    
        
        
            
                "completed_at": new Date('2026-03-23T15:10:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Draft medical necessity summary",
            
        
    
        
        
            
                "description": "Summarize clinical rationale and align to policy language for IMRT planning",
            
        
    
        
        
            
                "status": "done",
            
        
    
        
        
            
                "priority": "urgent",
            
        
    
        
        
            
                "due_at": new Date('2026-03-22T23:59:00Z'),
            
        
    
        
        
            
                "completed_at": new Date('2026-03-24T16:40:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Collect missing documentation",
            
        
    
        
        
            
                "description": "Obtain physician order and treatment plan to attach to appeal packet",
            
        
    
        
        
            
                "status": "done",
            
        
    
        
        
            
                "priority": "high",
            
        
    
        
        
            
                "due_at": new Date('2026-03-21T23:59:00Z'),
            
        
    
        
        
            
                "completed_at": new Date('2026-03-21T18:05:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Call payer for status update",
            
        
    
        
        
            
                "description": "Verify receipt of appeal and ask for expected determination date",
            
        
    
        
        
            
                "status": "done",
            
        
    
        
        
            
                "priority": "high",
            
        
    
        
        
            
                "due_at": new Date('2026-03-19T23:59:00Z'),
            
        
    
        
        
            
                "completed_at": new Date('2026-03-20T14:25:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Verify eligibility and coverage dates",
            
        
    
        
        
            
                "description": "Check member eligibility at date of service and gather proof of coverage if available",
            
        
    
        
        
            
                "status": "in_progress",
            
        
    
        
        
            
                "priority": "medium",
            
        
    
        
        
            
                "due_at": new Date('2026-03-27T23:59:00Z'),
            
        
    
        
        
            
                "completed_at": new Date('2026-03-28T09:00:00Z'),
            
        
    
    },
    
];



const DocumentsData = [
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "category": "letter_of_medical_necessity",
            
        
    
        
        
            
                "title": "Denial Letter 2026-03-08",
            
        
    
        
        
            
                "description": "Payer denial notice citing missing prior authorization",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "is_confidential": true,
            
        
    
        
        
            
                "received_at": new Date('2026-03-08T12:00:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "category": "denial_letter",
            
        
    
        
        
            
                "title": "Payer Policy Radiation Therapy Criteria",
            
        
    
        
        
            
                "description": "Policy excerpt referenced in denial for medical necessity",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "is_confidential": false,
            
        
    
        
        
            
                "received_at": new Date('2026-03-16T10:00:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "category": "letter_of_medical_necessity",
            
        
    
        
        
            
                "title": "Treatment Plan and Planning Note",
            
        
    
        
        
            
                "description": "IMRT plan summary and planning documentation",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "is_confidential": true,
            
        
    
        
        
            
                "received_at": new Date('2026-03-14T09:30:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "category": "denial_letter",
            
        
    
        
        
            
                "title": "Appeal Receipt Confirmation",
            
        
    
        
        
            
                "description": "Portal confirmation showing appeal received by payer",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "is_confidential": false,
            
        
    
        
        
            
                "received_at": new Date('2026-03-06T15:00:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "category": "correspondence",
            
        
    
        
        
            
                "title": "Claim Submission Detail",
            
        
    
        
        
            
                "description": "Claim summary including dates of service and billed codes",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "is_confidential": true,
            
        
    
        
        
            
                "received_at": new Date('2026-03-20T10:20:00Z'),
            
        
    
    },
    
];



const AppealDraftsData = [
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Appeal Letter Draft Prior Authorization",
            
        
    
        
        
            
                "status": "archived",
            
        
    
        
        
            
                "content": "This letter requests reconsideration of the denial based on clinical urgency and retro authorization eligibility. Supporting documentation is attached.",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-12T17:00:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Appeal Letter Draft Medical Necessity",
            
        
    
        
        
            
                "status": "draft",
            
        
    
        
        
            
                "content": "Clinical rationale supports the requested service. The documentation demonstrates alignment with policy criteria and standard of care.",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-18T16:10:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Appeal Letter Draft Documentation Correction",
            
        
    
        
        
            
                "status": "draft",
            
        
    
        
        
            
                "content": "Please accept the attached physician order and treatment plan. The original submission omitted these items in error.",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-16T12:30:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Appeal Letter Draft Policy Limitation Review",
            
        
    
        
        
            
                "status": "in_review",
            
        
    
        
        
            
                "content": "We request a policy-based review. The fractionation schedule is clinically appropriate and supported by guideline references.",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-07T13:15:00Z'),
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Appeal Letter Draft Eligibility Clarification",
            
        
    
        
        
            
                "status": "archived",
            
        
    
        
        
            
                "content": "We request reconsideration of the denial for eligibility. Documentation indicates active coverage on the date of service.",
            
        
    
        
        
            
                // type code here for "files" field
            
        
    
        
        
            
                "submitted_at": new Date('2026-03-21T09:40:00Z'),
            
        
    
    },
    
];



const NotesData = [
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Triage Summary",
            
        
    
        
        
            
                "body": "Reviewed denial letter and confirmed no prior authorization on file. Requested retro authorization pathway details from payer.",
            
        
    
        
        
            
                "is_private": true,
            
        
    
        
        
            
                "note_type": "follow_up",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Payer Call Log",
            
        
    
        
        
            
                "body": "Spoke with payer rep who advised to include policy section references and recent imaging summary. Reference number UCMW-REF-22031.",
            
        
    
        
        
            
                "is_private": true,
            
        
    
        
        
            
                "note_type": "submission",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Documentation Added",
            
        
    
        
        
            
                "body": "Uploaded physician order and planning note. Draft updated and routed for approval.",
            
        
    
        
        
            
                "is_private": true,
            
        
    
        
        
            
                "note_type": "outcome",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Escalation Requested",
            
        
    
        
        
            
                "body": "Requested expedited review due to treatment timeline. Confirmed appeal is in payer queue.",
            
        
    
        
        
            
                "is_private": true,
            
        
    
        
        
            
                "note_type": "payer_call",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "title": "Eligibility Check",
            
        
    
        
        
            
                "body": "Eligibility appears active per portal. Will attach portal screenshot and coverage letter if available.",
            
        
    
        
        
            
                "is_private": true,
            
        
    
        
        
            
                "note_type": "submission",
            
        
    
    },
    
];



const ActivityLogsData = [
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "entity_type": "document",
            
        
    
        
        
            
                "entity_key": "AC-2026-0001",
            
        
    
        
        
            
                "action": "created",
            
        
    
        
        
            
                "message": "Status changed to evidence_needed and task created for authorization history",
            
        
    
        
        
            
                "occurred_at": new Date('2026-03-12T09:05:00Z'),
            
        
    
        
        
            
                "ip_address": "10.10.12.21",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "entity_type": "user",
            
        
    
        
        
            
                "entity_key": "AC-2026-0002",
            
        
    
        
        
            
                "action": "status_changed",
            
        
    
        
        
            
                "message": "Uploaded payer policy excerpt for medical necessity appeal",
            
        
    
        
        
            
                "occurred_at": new Date('2026-03-16T10:02:00Z'),
            
        
    
        
        
            
                "ip_address": "10.10.12.34",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "entity_type": "payer",
            
        
    
        
        
            
                "entity_key": "AC-2026-0003",
            
        
    
        
        
            
                "action": "login",
            
        
    
        
        
            
                "message": "Appeal draft approved and sent with missing documentation attached",
            
        
    
        
        
            
                "occurred_at": new Date('2026-03-16T13:10:00Z'),
            
        
    
        
        
            
                "ip_address": "10.10.12.21",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "entity_type": "case",
            
        
    
        
        
            
                "entity_key": "AC-2026-0004",
            
        
    
        
        
            
                "action": "restored",
            
        
    
        
        
            
                "message": "Added note about escalation request and expected determination window",
            
        
    
        
        
            
                "occurred_at": new Date('2026-03-20T14:40:00Z'),
            
        
    
        
        
            
                "ip_address": "10.10.12.11",
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "entity_type": "case",
            
        
    
        
        
            
                "entity_key": "AC-2026-0005",
            
        
    
        
        
            
                "action": "priority_changed",
            
        
    
        
        
            
                "message": "Created task to verify eligibility and gather proof of coverage",
            
        
    
        
        
            
                "occurred_at": new Date('2026-03-21T09:15:00Z'),
            
        
    
        
        
            
                "ip_address": "10.10.12.21",
            
        
    
    },
    
];



const SettingsData = [
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "key": "default_case_priority",
            
        
    
        
        
            
                "value": "medium",
            
        
    
        
        
            
                "description": "Default priority assigned to new cases",
            
        
    
        
        
            
                "value_type": "number",
            
        
    
        
        
            
                "is_sensitive": true,
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "key": "default_case_due_days",
            
        
    
        
        
            
                "value": "14",
            
        
    
        
        
            
                "description": "Default number of days from intake to due date",
            
        
    
        
        
            
                "value_type": "number",
            
        
    
        
        
            
                "is_sensitive": false,
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "key": "hipaa_confidential_by_default",
            
        
    
        
        
            
                "value": "true",
            
        
    
        
        
            
                "description": "Mark uploaded documents as confidential by default",
            
        
    
        
        
            
                "value_type": "number",
            
        
    
        
        
            
                "is_sensitive": true,
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "key": "appeal_letter_footer",
            
        
    
        
        
            
                "value": "North Valley Oncology Group Revenue Cycle Department",
            
        
    
        
        
            
                "description": "Default footer text for appeal drafts",
            
        
    
        
        
            
                "value_type": "number",
            
        
    
        
        
            
                "is_sensitive": true,
            
        
    
    },
    
    {
    
        
        
            
                // type code here for "relation_one" field
            
        
    
        
        
            
                "key": "analytics_currency",
            
        
    
        
        
            
                "value": "USD",
            
        
    
        
        
            
                "description": "Currency code used in analytics and dashboards",
            
        
    
        
        
            
                "value_type": "json",
            
        
    
        
        
            
                "is_sensitive": false,
            
        
    
    },
    
];




    
    
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
            // Similar logic for "relation_many"
        
    
        
            
            async function associateUserWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const User0 = await Users.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (User0?.setOrganization)
                {
                    await
                    User0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const User1 = await Users.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (User1?.setOrganization)
                {
                    await
                    User1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const User2 = await Users.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (User2?.setOrganization)
                {
                    await
                    User2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const User3 = await Users.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (User3?.setOrganization)
                {
                    await
                    User3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const User4 = await Users.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (User4?.setOrganization)
                {
                    await
                    User4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    

    
    
    
    
    
        
    

    
    
    
        
            
            async function associatePayerWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Payer0 = await Payers.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Payer0?.setOrganization)
                {
                    await
                    Payer0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Payer1 = await Payers.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Payer1?.setOrganization)
                {
                    await
                    Payer1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Payer2 = await Payers.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Payer2?.setOrganization)
                {
                    await
                    Payer2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Payer3 = await Payers.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Payer3?.setOrganization)
                {
                    await
                    Payer3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Payer4 = await Payers.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Payer4?.setOrganization)
                {
                    await
                    Payer4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    

    
    
    
        
            
            async function associateCasWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Cas0 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Cas0?.setOrganization)
                {
                    await
                    Cas0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Cas1 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Cas1?.setOrganization)
                {
                    await
                    Cas1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Cas2 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Cas2?.setOrganization)
                {
                    await
                    Cas2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Cas3 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Cas3?.setOrganization)
                {
                    await
                    Cas3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Cas4 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Cas4?.setOrganization)
                {
                    await
                    Cas4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    
        
            
            async function associateCasWithPayer() {
            
                const relatedPayer0 = await Payers.findOne({
                    offset: Math.floor(Math.random() * (await Payers.count())),
                });
                const Cas0 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Cas0?.setPayer)
                {
                    await
                    Cas0.
                    setPayer(relatedPayer0);
                }
            
                const relatedPayer1 = await Payers.findOne({
                    offset: Math.floor(Math.random() * (await Payers.count())),
                });
                const Cas1 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Cas1?.setPayer)
                {
                    await
                    Cas1.
                    setPayer(relatedPayer1);
                }
            
                const relatedPayer2 = await Payers.findOne({
                    offset: Math.floor(Math.random() * (await Payers.count())),
                });
                const Cas2 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Cas2?.setPayer)
                {
                    await
                    Cas2.
                    setPayer(relatedPayer2);
                }
            
                const relatedPayer3 = await Payers.findOne({
                    offset: Math.floor(Math.random() * (await Payers.count())),
                });
                const Cas3 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Cas3?.setPayer)
                {
                    await
                    Cas3.
                    setPayer(relatedPayer3);
                }
            
                const relatedPayer4 = await Payers.findOne({
                    offset: Math.floor(Math.random() * (await Payers.count())),
                });
                const Cas4 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Cas4?.setPayer)
                {
                    await
                    Cas4.
                    setPayer(relatedPayer4);
                }
            
        }
        
    
        
            
            async function associateCasWithOwner_user() {
            
                const relatedOwner_user0 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Cas0 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Cas0?.setOwner_user)
                {
                    await
                    Cas0.
                    setOwner_user(relatedOwner_user0);
                }
            
                const relatedOwner_user1 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Cas1 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Cas1?.setOwner_user)
                {
                    await
                    Cas1.
                    setOwner_user(relatedOwner_user1);
                }
            
                const relatedOwner_user2 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Cas2 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Cas2?.setOwner_user)
                {
                    await
                    Cas2.
                    setOwner_user(relatedOwner_user2);
                }
            
                const relatedOwner_user3 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Cas3 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Cas3?.setOwner_user)
                {
                    await
                    Cas3.
                    setOwner_user(relatedOwner_user3);
                }
            
                const relatedOwner_user4 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Cas4 = await Cases.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Cas4?.setOwner_user)
                {
                    await
                    Cas4.
                    setOwner_user(relatedOwner_user4);
                }
            
        }
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    

    
    
    
        
            
            async function associateTaskWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Task0 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Task0?.setOrganization)
                {
                    await
                    Task0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Task1 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Task1?.setOrganization)
                {
                    await
                    Task1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Task2 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Task2?.setOrganization)
                {
                    await
                    Task2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Task3 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Task3?.setOrganization)
                {
                    await
                    Task3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Task4 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Task4?.setOrganization)
                {
                    await
                    Task4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    
        
            
            async function associateTaskWithCase() {
            
                const relatedCase0 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Task0 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Task0?.setCase)
                {
                    await
                    Task0.
                    setCase(relatedCase0);
                }
            
                const relatedCase1 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Task1 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Task1?.setCase)
                {
                    await
                    Task1.
                    setCase(relatedCase1);
                }
            
                const relatedCase2 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Task2 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Task2?.setCase)
                {
                    await
                    Task2.
                    setCase(relatedCase2);
                }
            
                const relatedCase3 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Task3 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Task3?.setCase)
                {
                    await
                    Task3.
                    setCase(relatedCase3);
                }
            
                const relatedCase4 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Task4 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Task4?.setCase)
                {
                    await
                    Task4.
                    setCase(relatedCase4);
                }
            
        }
        
    
        
            
            async function associateTaskWithAssignee_user() {
            
                const relatedAssignee_user0 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Task0 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Task0?.setAssignee_user)
                {
                    await
                    Task0.
                    setAssignee_user(relatedAssignee_user0);
                }
            
                const relatedAssignee_user1 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Task1 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Task1?.setAssignee_user)
                {
                    await
                    Task1.
                    setAssignee_user(relatedAssignee_user1);
                }
            
                const relatedAssignee_user2 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Task2 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Task2?.setAssignee_user)
                {
                    await
                    Task2.
                    setAssignee_user(relatedAssignee_user2);
                }
            
                const relatedAssignee_user3 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Task3 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Task3?.setAssignee_user)
                {
                    await
                    Task3.
                    setAssignee_user(relatedAssignee_user3);
                }
            
                const relatedAssignee_user4 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Task4 = await Tasks.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Task4?.setAssignee_user)
                {
                    await
                    Task4.
                    setAssignee_user(relatedAssignee_user4);
                }
            
        }
        
    
        
    
        
    
        
    
        
    
        
    
        
    

    
    
    
        
            
            async function associateDocumentWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Document0 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Document0?.setOrganization)
                {
                    await
                    Document0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Document1 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Document1?.setOrganization)
                {
                    await
                    Document1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Document2 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Document2?.setOrganization)
                {
                    await
                    Document2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Document3 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Document3?.setOrganization)
                {
                    await
                    Document3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Document4 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Document4?.setOrganization)
                {
                    await
                    Document4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    
        
            
            async function associateDocumentWithCase() {
            
                const relatedCase0 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Document0 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Document0?.setCase)
                {
                    await
                    Document0.
                    setCase(relatedCase0);
                }
            
                const relatedCase1 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Document1 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Document1?.setCase)
                {
                    await
                    Document1.
                    setCase(relatedCase1);
                }
            
                const relatedCase2 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Document2 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Document2?.setCase)
                {
                    await
                    Document2.
                    setCase(relatedCase2);
                }
            
                const relatedCase3 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Document3 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Document3?.setCase)
                {
                    await
                    Document3.
                    setCase(relatedCase3);
                }
            
                const relatedCase4 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Document4 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Document4?.setCase)
                {
                    await
                    Document4.
                    setCase(relatedCase4);
                }
            
        }
        
    
        
            
            async function associateDocumentWithUploaded_by_user() {
            
                const relatedUploaded_by_user0 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Document0 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Document0?.setUploaded_by_user)
                {
                    await
                    Document0.
                    setUploaded_by_user(relatedUploaded_by_user0);
                }
            
                const relatedUploaded_by_user1 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Document1 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Document1?.setUploaded_by_user)
                {
                    await
                    Document1.
                    setUploaded_by_user(relatedUploaded_by_user1);
                }
            
                const relatedUploaded_by_user2 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Document2 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Document2?.setUploaded_by_user)
                {
                    await
                    Document2.
                    setUploaded_by_user(relatedUploaded_by_user2);
                }
            
                const relatedUploaded_by_user3 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Document3 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Document3?.setUploaded_by_user)
                {
                    await
                    Document3.
                    setUploaded_by_user(relatedUploaded_by_user3);
                }
            
                const relatedUploaded_by_user4 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Document4 = await Documents.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Document4?.setUploaded_by_user)
                {
                    await
                    Document4.
                    setUploaded_by_user(relatedUploaded_by_user4);
                }
            
        }
        
    
        
    
        
    
        
    
        
    
        
    
        
    

    
    
    
        
            
            async function associateAppealDraftWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const AppealDraft0 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (AppealDraft0?.setOrganization)
                {
                    await
                    AppealDraft0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const AppealDraft1 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (AppealDraft1?.setOrganization)
                {
                    await
                    AppealDraft1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const AppealDraft2 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (AppealDraft2?.setOrganization)
                {
                    await
                    AppealDraft2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const AppealDraft3 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (AppealDraft3?.setOrganization)
                {
                    await
                    AppealDraft3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const AppealDraft4 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (AppealDraft4?.setOrganization)
                {
                    await
                    AppealDraft4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    
        
            
            async function associateAppealDraftWithCase() {
            
                const relatedCase0 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const AppealDraft0 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (AppealDraft0?.setCase)
                {
                    await
                    AppealDraft0.
                    setCase(relatedCase0);
                }
            
                const relatedCase1 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const AppealDraft1 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (AppealDraft1?.setCase)
                {
                    await
                    AppealDraft1.
                    setCase(relatedCase1);
                }
            
                const relatedCase2 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const AppealDraft2 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (AppealDraft2?.setCase)
                {
                    await
                    AppealDraft2.
                    setCase(relatedCase2);
                }
            
                const relatedCase3 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const AppealDraft3 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (AppealDraft3?.setCase)
                {
                    await
                    AppealDraft3.
                    setCase(relatedCase3);
                }
            
                const relatedCase4 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const AppealDraft4 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (AppealDraft4?.setCase)
                {
                    await
                    AppealDraft4.
                    setCase(relatedCase4);
                }
            
        }
        
    
        
            
            async function associateAppealDraftWithAuthor_user() {
            
                const relatedAuthor_user0 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const AppealDraft0 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (AppealDraft0?.setAuthor_user)
                {
                    await
                    AppealDraft0.
                    setAuthor_user(relatedAuthor_user0);
                }
            
                const relatedAuthor_user1 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const AppealDraft1 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (AppealDraft1?.setAuthor_user)
                {
                    await
                    AppealDraft1.
                    setAuthor_user(relatedAuthor_user1);
                }
            
                const relatedAuthor_user2 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const AppealDraft2 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (AppealDraft2?.setAuthor_user)
                {
                    await
                    AppealDraft2.
                    setAuthor_user(relatedAuthor_user2);
                }
            
                const relatedAuthor_user3 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const AppealDraft3 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (AppealDraft3?.setAuthor_user)
                {
                    await
                    AppealDraft3.
                    setAuthor_user(relatedAuthor_user3);
                }
            
                const relatedAuthor_user4 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const AppealDraft4 = await AppealDrafts.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (AppealDraft4?.setAuthor_user)
                {
                    await
                    AppealDraft4.
                    setAuthor_user(relatedAuthor_user4);
                }
            
        }
        
    
        
    
        
    
        
    
        
    
        
    

    
    
    
        
            
            async function associateNoteWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Note0 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Note0?.setOrganization)
                {
                    await
                    Note0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Note1 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Note1?.setOrganization)
                {
                    await
                    Note1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Note2 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Note2?.setOrganization)
                {
                    await
                    Note2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Note3 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Note3?.setOrganization)
                {
                    await
                    Note3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Note4 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Note4?.setOrganization)
                {
                    await
                    Note4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    
        
            
            async function associateNoteWithCase() {
            
                const relatedCase0 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Note0 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Note0?.setCase)
                {
                    await
                    Note0.
                    setCase(relatedCase0);
                }
            
                const relatedCase1 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Note1 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Note1?.setCase)
                {
                    await
                    Note1.
                    setCase(relatedCase1);
                }
            
                const relatedCase2 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Note2 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Note2?.setCase)
                {
                    await
                    Note2.
                    setCase(relatedCase2);
                }
            
                const relatedCase3 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Note3 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Note3?.setCase)
                {
                    await
                    Note3.
                    setCase(relatedCase3);
                }
            
                const relatedCase4 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const Note4 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Note4?.setCase)
                {
                    await
                    Note4.
                    setCase(relatedCase4);
                }
            
        }
        
    
        
            
            async function associateNoteWithAuthor_user() {
            
                const relatedAuthor_user0 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Note0 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Note0?.setAuthor_user)
                {
                    await
                    Note0.
                    setAuthor_user(relatedAuthor_user0);
                }
            
                const relatedAuthor_user1 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Note1 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Note1?.setAuthor_user)
                {
                    await
                    Note1.
                    setAuthor_user(relatedAuthor_user1);
                }
            
                const relatedAuthor_user2 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Note2 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Note2?.setAuthor_user)
                {
                    await
                    Note2.
                    setAuthor_user(relatedAuthor_user2);
                }
            
                const relatedAuthor_user3 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Note3 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Note3?.setAuthor_user)
                {
                    await
                    Note3.
                    setAuthor_user(relatedAuthor_user3);
                }
            
                const relatedAuthor_user4 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const Note4 = await Notes.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Note4?.setAuthor_user)
                {
                    await
                    Note4.
                    setAuthor_user(relatedAuthor_user4);
                }
            
        }
        
    
        
    
        
    
        
    
        
    

    
    
    
        
            
            async function associateActivityLogWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const ActivityLog0 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (ActivityLog0?.setOrganization)
                {
                    await
                    ActivityLog0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const ActivityLog1 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (ActivityLog1?.setOrganization)
                {
                    await
                    ActivityLog1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const ActivityLog2 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (ActivityLog2?.setOrganization)
                {
                    await
                    ActivityLog2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const ActivityLog3 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (ActivityLog3?.setOrganization)
                {
                    await
                    ActivityLog3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const ActivityLog4 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (ActivityLog4?.setOrganization)
                {
                    await
                    ActivityLog4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    
        
            
            async function associateActivityLogWithCase() {
            
                const relatedCase0 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const ActivityLog0 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (ActivityLog0?.setCase)
                {
                    await
                    ActivityLog0.
                    setCase(relatedCase0);
                }
            
                const relatedCase1 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const ActivityLog1 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (ActivityLog1?.setCase)
                {
                    await
                    ActivityLog1.
                    setCase(relatedCase1);
                }
            
                const relatedCase2 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const ActivityLog2 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (ActivityLog2?.setCase)
                {
                    await
                    ActivityLog2.
                    setCase(relatedCase2);
                }
            
                const relatedCase3 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const ActivityLog3 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (ActivityLog3?.setCase)
                {
                    await
                    ActivityLog3.
                    setCase(relatedCase3);
                }
            
                const relatedCase4 = await Cases.findOne({
                    offset: Math.floor(Math.random() * (await Cases.count())),
                });
                const ActivityLog4 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (ActivityLog4?.setCase)
                {
                    await
                    ActivityLog4.
                    setCase(relatedCase4);
                }
            
        }
        
    
        
            
            async function associateActivityLogWithActor_user() {
            
                const relatedActor_user0 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const ActivityLog0 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (ActivityLog0?.setActor_user)
                {
                    await
                    ActivityLog0.
                    setActor_user(relatedActor_user0);
                }
            
                const relatedActor_user1 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const ActivityLog1 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (ActivityLog1?.setActor_user)
                {
                    await
                    ActivityLog1.
                    setActor_user(relatedActor_user1);
                }
            
                const relatedActor_user2 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const ActivityLog2 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (ActivityLog2?.setActor_user)
                {
                    await
                    ActivityLog2.
                    setActor_user(relatedActor_user2);
                }
            
                const relatedActor_user3 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const ActivityLog3 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (ActivityLog3?.setActor_user)
                {
                    await
                    ActivityLog3.
                    setActor_user(relatedActor_user3);
                }
            
                const relatedActor_user4 = await Users.findOne({
                    offset: Math.floor(Math.random() * (await Users.count())),
                });
                const ActivityLog4 = await ActivityLogs.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (ActivityLog4?.setActor_user)
                {
                    await
                    ActivityLog4.
                    setActor_user(relatedActor_user4);
                }
            
        }
        
    
        
    
        
    
        
    
        
    
        
    
        
    

    
    
    
        
            
            async function associateSettingWithOrganization() {
            
                const relatedOrganization0 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Setting0 = await Settings.findOne({
                    order: [['id', 'ASC']],
                    offset: 0
                });
                if (Setting0?.setOrganization)
                {
                    await
                    Setting0.
                    setOrganization(relatedOrganization0);
                }
            
                const relatedOrganization1 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Setting1 = await Settings.findOne({
                    order: [['id', 'ASC']],
                    offset: 1
                });
                if (Setting1?.setOrganization)
                {
                    await
                    Setting1.
                    setOrganization(relatedOrganization1);
                }
            
                const relatedOrganization2 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Setting2 = await Settings.findOne({
                    order: [['id', 'ASC']],
                    offset: 2
                });
                if (Setting2?.setOrganization)
                {
                    await
                    Setting2.
                    setOrganization(relatedOrganization2);
                }
            
                const relatedOrganization3 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Setting3 = await Settings.findOne({
                    order: [['id', 'ASC']],
                    offset: 3
                });
                if (Setting3?.setOrganization)
                {
                    await
                    Setting3.
                    setOrganization(relatedOrganization3);
                }
            
                const relatedOrganization4 = await Organizations.findOne({
                    offset: Math.floor(Math.random() * (await Organizations.count())),
                });
                const Setting4 = await Settings.findOne({
                    order: [['id', 'ASC']],
                    offset: 4
                });
                if (Setting4?.setOrganization)
                {
                    await
                    Setting4.
                    setOrganization(relatedOrganization4);
                }
            
        }
        
    
        
    
        
    
        
    
        
    
        
    


module.exports = {
    up: async () => {
        if (process.env.ENABLE_DEMO_SEEDING !== 'true') {
            return;
        }

        
            
            
            
            
            
                
                await Organizations.bulkCreate(OrganizationsData);
                
            
            
                
                await Payers.bulkCreate(PayersData);
                
            
            
                
                await Cases.bulkCreate(CasesData);
                
            
            
                
                await Tasks.bulkCreate(TasksData);
                
            
            
                
                await Documents.bulkCreate(DocumentsData);
                
            
            
                
                await AppealDrafts.bulkCreate(AppealDraftsData);
                
            
            
                
                await Notes.bulkCreate(NotesData);
                
            
            
                
                await ActivityLogs.bulkCreate(ActivityLogsData);
                
            
            
                
                await Settings.bulkCreate(SettingsData);
                
            
            await Promise.all([
            
                
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                        // Similar logic for "relation_many"
                    
                
                    
                        
                        await associateUserWithOrganization(),
                    
                
            
                
                
                
                
                    
                
            
                
                
                    
                        
                        await associatePayerWithOrganization(),
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
            
                
                
                    
                        
                        await associateCasWithOrganization(),
                    
                
                    
                        
                        await associateCasWithPayer(),
                    
                
                    
                        
                        await associateCasWithOwner_user(),
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
            
                
                
                    
                        
                        await associateTaskWithOrganization(),
                    
                
                    
                        
                        await associateTaskWithCase(),
                    
                
                    
                        
                        await associateTaskWithAssignee_user(),
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
            
                
                
                    
                        
                        await associateDocumentWithOrganization(),
                    
                
                    
                        
                        await associateDocumentWithCase(),
                    
                
                    
                        
                        await associateDocumentWithUploaded_by_user(),
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
            
                
                
                    
                        
                        await associateAppealDraftWithOrganization(),
                    
                
                    
                        
                        await associateAppealDraftWithCase(),
                    
                
                    
                        
                        await associateAppealDraftWithAuthor_user(),
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
            
                
                
                    
                        
                        await associateNoteWithOrganization(),
                    
                
                    
                        
                        await associateNoteWithCase(),
                    
                
                    
                        
                        await associateNoteWithAuthor_user(),
                    
                
                    
                
                    
                
                    
                
                    
                
            
                
                
                    
                        
                        await associateActivityLogWithOrganization(),
                    
                
                    
                        
                        await associateActivityLogWithCase(),
                    
                
                    
                        
                        await associateActivityLogWithActor_user(),
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
            
                
                
                    
                        
                        await associateSettingWithOrganization(),
                    
                
                    
                
                    
                
                    
                
                    
                
                    
                
            
            ]);
        
    },

    down: async (queryInterface) => {
        if (process.env.ENABLE_DEMO_SEEDING !== 'true') {
            return;
        }

        
            
            
            
            
            
            await queryInterface.bulkDelete('organizations', null, {});
            
            
            await queryInterface.bulkDelete('payers', null, {});
            
            
            await queryInterface.bulkDelete('cases', null, {});
            
            
            await queryInterface.bulkDelete('tasks', null, {});
            
            
            await queryInterface.bulkDelete('documents', null, {});
            
            
            await queryInterface.bulkDelete('appeal_drafts', null, {});
            
            
            await queryInterface.bulkDelete('notes', null, {});
            
            
            await queryInterface.bulkDelete('activity_logs', null, {});
            
            
            await queryInterface.bulkDelete('settings', null, {});
            
        
    },
};
