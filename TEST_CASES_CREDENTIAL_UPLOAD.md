# Test Cases: Upload Credential Page

## Overview
This document contains comprehensive test cases for the Credential Upload feature in HeightechX application.

---

## Test Scenario 1: Access Control - No DID Generated
**Test ID:** TC-CU-001
**Objective:** Verify that users cannot access credential upload without a DID

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Navigate to upload page | Click "Upload Credential" without generating DID | User is shown "DID Required" message | ⚠️ Cannot Proceed |
| 2 | Verify blocking message | Read the message | Message states "Generate your Decentralized Identifier first" | ⚠️ Cannot Proceed |
| 3 | Check back button | Click "Back" button | User returns to previous page | ⚠️ Cannot Proceed |

**Precondition:** User is logged in but has NOT generated a DID
**Result:** Test blocked on missing DID

---

## Test Scenario 2: Step 1 - Credential Details Form - Education Credential
**Test ID:** TC-CU-002
**Objective:** Test credential details entry for Education Credential type

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Navigate to upload page | Access credential upload page | Step 1 "Details" is highlighted and visible | ✅ Pass |
| 2 | Select credential type | Choose "Education Credential" from dropdown | Dropdown shows selected value | ✅ Pass |
| 3 | Enter full name | Input "John Doe" in Full Name field | Value appears in input field | ✅ Pass |
| 4 | Enter email | Input "john.doe@university.edu" | Email appears in field | ✅ Pass |
| 5 | Enter issuer DID | Input issuer DID or leave empty | Field accepts input or uses default DID | ✅ Pass |
| 6 | Verify issuance date | Check pre-filled current date | Today's date is auto-populated | ✅ Pass |
| 7 | Enter expiration date | Input future date "2026-12-31" | Date appears in field | ✅ Pass |
| 8 | Click Next button | Click "Next: Upload File" | Page moves to Step 2 | ✅ Pass |

**Precondition:** User has generated a DID and is on upload page
**Data:**
- Credential Type: Education Credential
- Full Name: John Doe
- Email: john.doe@university.edu
- Issuance Date: (Today's date)
- Expiration Date: 2026-12-31

---

## Test Scenario 3: Step 1 - Validation - Missing Required Fields
**Test ID:** TC-CU-003
**Objective:** Verify form validation for required fields

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Leave name field empty | Click "Next: Upload File" without name | Form shows validation error | ✅ Pass |
| 2 | Fill name but not email | Enter name, leave email empty | Click Next shows email error | ✅ Pass |
| 3 | Fill email but not date | Enter email, leave date empty | Click Next shows date error | ✅ Pass |
| 4 | Fill all required fields | Complete: name, email, date | Next button is enabled | ✅ Pass |
| 5 | Try invalid email | Enter "invalid-email" | Email field shows validation error | ✅ Pass |
| 6 | Enter valid email | Input "valid@email.com" | Validation passes | ✅ Pass |

**Precondition:** User is on Step 1 of credential upload
**Data:**
- Invalid Email: invalid-email
- Valid Email: valid@email.com

---

## Test Scenario 4: Step 1 - All Credential Types
**Test ID:** TC-CU-004
**Objective:** Verify all credential type options work correctly

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Select Education Credential | Choose from dropdown | Selected and displayed | ✅ Pass |
| 2 | Select Identity Credential | Change dropdown selection | Selected and displayed | ✅ Pass |
| 3 | Select Proof of Residence | Change dropdown selection | Selected and displayed | ✅ Pass |
| 4 | Select Professional Certification | Change dropdown selection | Selected and displayed | ✅ Pass |
| 5 | Verify persistence | Fill form, change type, go back | Form retains entered data | ✅ Pass |

**Precondition:** User is on Step 1
**Credential Types Available:**
- Education Credential
- Identity Credential
- Proof of Residence
- Professional Certification

---

## Test Scenario 5: Step 2 - File Upload - Valid File
**Test ID:** TC-CU-005
**Objective:** Test successful file upload to IPFS

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Complete Step 1 form | Fill all required fields and click Next | User moves to Step 2 | ✅ Pass |
| 2 | Verify Step 2 display | Check upload area | Drag & drop zone is visible | ✅ Pass |
| 3 | Click upload area | Click on dashed border area | File browser dialog opens | ✅ Pass |
| 4 | Select PDF file | Choose "sample_credential.pdf" | File is selected | ✅ Pass |
| 5 | Verify file upload | Wait for IPFS upload | Toast message: "File uploaded to IPFS!" | ✅ Pass |
| 6 | Check IPFS hash | Verify hash displayed | IPFS hash shown in green box (Qm...) | ✅ Pass |
| 7 | Check file size | Verify file metadata | File name and size (KB) displayed | ✅ Pass |
| 8 | Proceed to Step 3 | Click "Next: Review" button | User moves to Step 3 | ✅ Pass |

**Precondition:** User completed Step 1 with valid data
**Test Data:**
- File: sample_credential.pdf
- File Size: ~50 KB
- Supported Formats: JSON, PDF, DOC, DOCX

---

## Test Scenario 6: Step 2 - File Upload - Drag & Drop
**Test ID:** TC-CU-006
**Objective:** Test drag and drop file upload functionality

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Be on Step 2 | User is on upload file step | Drop zone is visible | ✅ Pass |
| 2 | Drag file over zone | Drag "certificate.pdf" over zone | Drop zone highlights/changes color | ✅ Pass |
| 3 | Drop file | Release file | File uploads automatically | ✅ Pass |
| 4 | Wait for processing | File processing in progress | Loading indicator appears | ✅ Pass |
| 5 | Verify upload success | Upload completes | IPFS hash is displayed | ✅ Pass |
| 6 | Check toast message | Verify notification | Success toast shows "File uploaded to IPFS!" | ✅ Pass |

**Precondition:** User is on Step 2 upload page
**Test Data:**
- File to Drag: certificate.pdf (100 KB)

---

## Test Scenario 7: Step 2 - File Upload - Invalid File Type
**Test ID:** TC-CU-007
**Objective:** Verify that invalid file types are rejected

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Attempt to upload image | Select "image.png" file | File is rejected or not uploaded | ✅ Pass |
| 2 | Try video file | Select "video.mp4" file | File upload fails/not allowed | ✅ Pass |
| 3 | Upload text file | Select ".txt" file | File upload fails | ✅ Pass |
| 4 | Try valid JSON | Select "data.json" file | File uploads successfully | ✅ Pass |
| 5 | Try valid DOCX | Select "document.docx" file | File uploads successfully | ✅ Pass |

**Precondition:** User is on Step 2
**Invalid File Types:** .png, .mp4, .txt, .exe
**Valid File Types:** .json, .pdf, .doc, .docx

---

## Test Scenario 8: Step 2 - Large File Upload
**Test ID:** TC-CU-008
**Objective:** Test handling of large files

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Upload 5 MB file | Select large PDF file | File is uploaded (may take time) | ✅ Pass |
| 2 | Monitor progress | Watch for loading state | Loading indicator shows progress | ✅ Pass |
| 3 | Verify upload | Wait for completion | IPFS hash appears when complete | ✅ Pass |
| 4 | Upload 50+ MB file | Attempt very large file | Error message shown or rejected | ⚠️ Check Behavior |

**Precondition:** User is on Step 2
**Test Data:**
- Large File: 5 MB PDF
- Very Large File: 50 MB PDF

---

## Test Scenario 9: Step 2 - Back Navigation
**Test ID:** TC-CU-009
**Objective:** Verify navigation between steps without data loss

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Upload file | Complete file upload to IPFS | IPFS hash is displayed | ✅ Pass |
| 2 | Click Back button | Go back to Step 1 | Returned to Step 1 (Details) | ✅ Pass |
| 3 | Verify data persisted | Check form fields | All previously entered data remains | ✅ Pass |
| 4 | Return to Step 2 | Click Next again | Original file upload is still there | ✅ Pass |

**Precondition:** User has completed Step 1 and uploaded file in Step 2
**Expected Behavior:** Data persistence across step navigation

---

## Test Scenario 10: Step 3 - Review Credential Details
**Test ID:** TC-CU-010
**Objective:** Verify review page displays all credential information correctly

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Complete Step 1 & 2 | Fill form and upload file | Review page Step 3 is shown | ✅ Pass |
| 2 | Check credential type | Review section shows Type | "Education Credential" displayed | ✅ Pass |
| 3 | Verify name | Review shows Name field | "John Doe" displayed correctly | ✅ Pass |
| 4 | Verify email | Review shows Email field | "john.doe@university.edu" displayed | ✅ Pass |
| 5 | Check issuance date | Review shows Issued date | Correct date displayed | ✅ Pass |
| 6 | Verify attached file | Review section shows file | "certificate.pdf" name displayed | ✅ Pass |
| 7 | Check security badges | Verify indicators shown | "Cryptographically Signed" badge visible | ✅ Pass |
| 8 | Check IPFS indicator | Verify storage info | "IPFS Stored" badge visible | ✅ Pass |

**Precondition:** User completed Steps 1 and 2
**Test Data:**
- Name: John Doe
- Email: john.doe@university.edu
- File: certificate.pdf
- Issuance Date: 2024-01-15

---

## Test Scenario 11: Step 3 - Submit Credential
**Test ID:** TC-CU-011
**Objective:** Test successful credential submission

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Review credential | Verify all details are correct | Review page shows all information | ✅ Pass |
| 2 | Click Submit button | Click "Submit Credential" button | Loading state begins (button disabled) | ✅ Pass |
| 3 | Wait for processing | System processes credential | Loading spinner appears | ✅ Pass |
| 4 | Verify success message | Toast notification appears | "Credential uploaded successfully!" shown | ✅ Pass |
| 5 | Check navigation | Wait 1.5 seconds | User redirected to /credentials page | ✅ Pass |
| 6 | Verify in list | Check credentials list | New credential appears in list | ✅ Pass |
| 7 | Verify metadata | Check credential details | All entered data is preserved | ✅ Pass |

**Precondition:** User is on Step 3 review page
**Expected Outcome:** Credential saved and user redirected

---

## Test Scenario 12: Step 3 - Back to Edit
**Test ID:** TC-CU-012
**Objective:** Allow user to go back and edit before final submission

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Be on Step 3 | User on review page | Review page displayed | ✅ Pass |
| 2 | Click Back button | Return to Step 2 | File upload step shown | ✅ Pass |
| 3 | Click Back again | Return to Step 1 | Details form shown | ✅ Pass |
| 4 | Modify name | Change name to "Jane Doe" | Field updated | ✅ Pass |
| 5 | Proceed to Step 2 | Click Next | File upload step shown again | ✅ Pass |
| 6 | Upload new file | Select different file | New file uploaded | ✅ Pass |
| 7 | Proceed to Step 3 | Click Next | Review shows updated data | ✅ Pass |
| 8 | Verify updated data | Check review page | Name shows "Jane Doe" and new file | ✅ Pass |

**Precondition:** User on Step 3
**Modification:** Change name from "John Doe" to "Jane Doe"

---

## Test Scenario 13: Error Handling - IPFS Upload Failure
**Test ID:** TC-CU-013
**Objective:** Test graceful handling of IPFS upload failures

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Simulate network issue | Upload file with bad connection | IPFS upload fails | ⚠️ Manual |
| 2 | Check error message | Observe notification | Toast shows "Failed to upload file to IPFS" | ⚠️ Manual |
| 3 | Retry upload | Try uploading same file again | Can retry without losing form data | ⚠️ Manual |

**Precondition:** User on Step 2, network connectivity issue
**Expected Behavior:** Error message shown, can retry

---

## Test Scenario 14: Error Handling - Credential Submission Failure
**Test ID:** TC-CU-014
**Objective:** Test handling of submission errors

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Submit credential | Click submit on Step 3 | Submission initiates | ⚠️ Manual |
| 2 | Simulate error | Backend returns error | Error toast displayed | ⚠️ Manual |
| 3 | Check error message | Read notification | Appropriate error message shown | ⚠️ Manual |
| 4 | Retry submission | User can click submit again | Retry is possible | ⚠️ Manual |
| 5 | Verify data preserved | Check form data | All entered data still there | ⚠️ Manual |

**Precondition:** User on Step 3
**Expected Behavior:** Error handling with ability to retry

---

## Test Scenario 15: Form Persistence - Professional Certification
**Test ID:** TC-CU-015
**Objective:** Test with Professional Certification credential type

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Select credential type | Choose "Professional Certification" | Type selected | ✅ Pass |
| 2 | Enter name | "Jane Smith" | Name entered | ✅ Pass |
| 3 | Enter email | "jane.smith@company.com" | Email entered | ✅ Pass |
| 4 | Enter issuer | Custom issuer DID | Issuer entered | ✅ Pass |
| 5 | Set issuance date | "2024-06-15" | Date set | ✅ Pass |
| 6 | Set expiration date | "2027-06-15" | 3-year validity | ✅ Pass |
| 7 | Upload certificate | Upload certification.pdf | File uploaded | ✅ Pass |
| 8 | Review all fields | Check Step 3 review | All data correct | ✅ Pass |
| 9 | Submit credential | Click submit | Credential saved | ✅ Pass |

**Precondition:** User is on credential upload page with DID
**Credential Type:** Professional Certification
**Test Data:**
- Name: Jane Smith
- Email: jane.smith@company.com
- Issuance Date: 2024-06-15
- Expiration Date: 2027-06-15

---

## Test Scenario 16: Form Persistence - Proof of Residence
**Test ID:** TC-CU-016
**Objective:** Test with Proof of Residence credential type

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Select credential type | Choose "Proof of Residence" | Type selected | ✅ Pass |
| 2 | Enter name | "Alice Johnson" | Name entered | ✅ Pass |
| 3 | Enter email | "alice@example.com" | Email entered | ✅ Pass |
| 4 | Enter issuer | Local authority DID | Issuer entered | ✅ Pass |
| 5 | Upload proof document | Upload residence_proof.pdf | File uploaded | ✅ Pass |
| 6 | Review fields | Check Step 3 review | All data correct | ✅ Pass |
| 7 | Submit credential | Click submit | Credential saved | ✅ Pass |
| 8 | Verify in list | Check credentials page | New credential in list | ✅ Pass |

**Precondition:** User has DID
**Credential Type:** Proof of Residence
**Test Data:**
- Name: Alice Johnson
- Email: alice@example.com

---

## Test Scenario 17: Edge Case - Identical Credentials
**Test ID:** TC-CU-017
**Objective:** Test uploading multiple identical credentials

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Upload credential | Complete first upload | Credential 1 created | ✅ Pass |
| 2 | Upload same details | Fill form with identical data | Form accepts duplicate | ✅ Pass |
| 3 | Upload same file | Use same file again | File uploaded again | ✅ Pass |
| 4 | Submit | Click submit | Credential 2 created | ✅ Pass |
| 5 | Verify both exist | Check credentials list | Both credentials shown with different IDs | ✅ Pass |

**Precondition:** User has already uploaded a credential
**Expected Behavior:** System allows duplicate credentials with unique IDs

---

## Test Scenario 18: Special Characters in Fields
**Test ID:** TC-CU-018
**Objective:** Test handling of special characters in form fields

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Enter name with accents | "José García" | Name accepted | ✅ Pass |
| 2 | Enter name with symbols | "O'Brien-Smith" | Name accepted | ✅ Pass |
| 3 | Enter email with + | "user+tag@example.com" | Email accepted | ✅ Pass |
| 4 | Enter Unicode name | "李明" (Chinese) | Name accepted | ✅ Pass |
| 5 | Submit credential | Complete submission | Credentials saved with special chars | ✅ Pass |
| 6 | Verify display | Check review and list | Special characters displayed correctly | ✅ Pass |

**Precondition:** User on Step 1
**Test Data:**
- Name with accents: José García
- Name with symbols: O'Brien-Smith
- Email with +: user+tag@example.com
- Unicode name: 李明

---

## Test Scenario 19: Boundary Testing - Date Fields
**Test ID:** TC-CU-019
**Objective:** Test date field edge cases

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Set past issuance date | Select date 10 years ago | Date accepted | ✅ Pass |
| 2 | Set future issuance date | Select date in future | Date accepted | ✅ Pass |
| 3 | Set expiration before issuance | Expiration < Issuance | System behavior (accept/reject?) | ⚠️ Check |
| 4 | Set same expiration date | Both dates identical | Should be allowed | ⚠️ Check |
| 5 | Leave expiration empty | Optional field | Form accepts submission | ✅ Pass |
| 6 | Set very far future | Year 2099 | Date accepted | ✅ Pass |

**Precondition:** User on Step 1
**Edge Cases:**
- Issuance: 2014-01-15
- Future Issuance: 2026-12-31
- Same Date: 2024-06-15

---

## Test Scenario 20: Performance - Multiple Rapid Submissions
**Test ID:** TC-CU-020
**Objective:** Test system stability under rapid requests

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| 1 | Complete credential 1 | Fill form and submit | Credential 1 created | ✅ Pass |
| 2 | Complete credential 2 | Fill different form and submit | Credential 2 created | ✅ Pass |
| 3 | Complete credential 3 | Fill different form and submit | Credential 3 created | ✅ Pass |
| 4 | Check performance | Monitor no lag/errors | System remains responsive | ✅ Pass |
| 5 | Verify all created | Check credentials page | All 3 credentials present | ✅ Pass |

**Precondition:** User has DID
**Expected Behavior:** System handles multiple submissions without issues

---

## Summary of Test Coverage

| Category | Test Count | Status |
|----------|-----------|--------|
| Access Control | 1 | ⚠️ Blocked |
| Form Validation | 3 | ✅ Pass |
| Credential Types | 3 | ✅ Pass |
| File Upload | 3 | ✅ Pass |
| Navigation | 2 | ✅ Pass |
| Review & Submit | 2 | ✅ Pass |
| Error Handling | 2 | ⚠️ Manual |
| Edge Cases | 3 | ✅ Pass |
| Performance | 1 | ✅ Pass |
| **TOTAL** | **20** | **✅ Mostly Pass** |

---

## Notes for QA Team

### Prerequisites for Testing
1. User must be authenticated (signed in)
2. User must have generated a DID before uploading credentials
3. IPFS must be initialized and working
4. Network connectivity required for file uploads

### Manual Testing Tips
- Use real files (PDF, DOC, DOCX, JSON) for testing
- Test with different file sizes (small, medium, large)
- Test with different character sets in names
- Monitor browser console for errors
- Check localStorage for persisted data

### Browser Compatibility
- Test on Chrome, Firefox, Safari
- Test on mobile browsers (iOS Safari, Chrome Mobile)
- Verify responsive design on different screen sizes

### Known Limitations
- Very large files (>50MB) may have upload issues
- Character encoding depends on browser support
- IPFS upload speed depends on network

---

## Defect Tracking Template

If defects are found during testing, please report using:
- **Test Case ID:** TC-CU-XXX
- **Severity:** Critical/High/Medium/Low
- **Description:** Clear description of the issue
- **Steps to Reproduce:** Exact steps
- **Expected vs Actual:** What should happen vs what happens
- **Environment:** Browser, OS, Network conditions
- **Screenshots/Logs:** Attach evidence

