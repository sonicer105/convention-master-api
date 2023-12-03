const config = require("config");

class ReportSponsor {
    constructor(currentMembershipType, badgeDisplayCode, realFirst, realLast, fanName) {
        this.currentMembershipType = currentMembershipType;
        this.badgeDisplayCode = badgeDisplayCode;
        this.realFirst = realFirst;
        this.realLast = realLast;
        this.fanName = fanName;
    }

    get displayName() {
        var badgeTypePreferName = config.get("conventionMaster.badgeTypePreferName");
        var badgeTypeNaverName = config.get("conventionMaster.badgeTypeNaverName");
        if(badgeTypeNaverName.includes(this.badgeDisplayCode)){
            return (this.fanName.length > 0) ? this.fanName : '';
        } else if(badgeTypePreferName.includes(this.badgeDisplayCode)){
            return this.realFirst + ' ' + this.realLast;
        }
        return (this.fanName.length > 0) ? this.fanName : this.realFirst + ' ' + this.realLast;
    }

    toJSON() {
        return {
            currentMembershipType: this.currentMembershipType,
            badgeDisplayCode: this.badgeDisplayCode,
            realFirst: this.realFirst,
            realLast: this.realLast,
            fanName: this.fanName,
            displayName: this.displayName
        }
    }
}

module.exports = ReportSponsor;