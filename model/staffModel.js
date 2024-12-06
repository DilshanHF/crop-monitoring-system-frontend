export default class StaffModel {
    constructor(staffId, firstName, lastName, staffDesignation, gender, joinedDate, DOB, addressLine01, addressLine02, addressLine03, addressLine04, addressLine05, contact, email, jobRole, image, logCode, fieldIds) {
        this.staffId = staffId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.staffDesignation = staffDesignation;
        this.gender = gender;
        this.joinedDate = joinedDate;
        this.DOB = DOB;
        this.addressLine01 = addressLine01;
        this.addressLine02 = addressLine02;
        this.addressLine03 = addressLine03;
        this.addressLine04 = addressLine04;
        this.addressLine05 = addressLine05;
        this.contact = contact;
        this.email = email;
        this.jobRole = jobRole;
        this.image = image;
        this.logCode = logCode;
        this.fieldIds = fieldIds;
    }
}