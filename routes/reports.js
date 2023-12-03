/**
 * @swagger
 * components:
 *   schemas:
 *     ReportSponsors:
 *       type: object
 *       required:
 *       properties:
 *         currentMembershipType:
 *           type: string
 *           description: The registrant's membership level.
 *         badgeDisplayCode:
 *           type: string
 *           description: The registrant's preference for how the badge name should be displayed.
 *         realFirst:
 *           type: string
 *           description: The registrant's first name.
 *         realLast:
 *           type: string
 *           description: The registrant's last name.
 *         fanName:
 *           type: string
 *           description: The registrant's fan name.
 *         displayName:
 *           type: string
 *           description: The parsed version of the name that should be shown for this registrant. Based on badgeDisplayCode and the api configuration. This field being blank indicates this registration should not be displayed.
 *       example:
 *         currentMembershipType: Sponsor
 *         badgeDisplayCode: FNO
 *         realFirst: John
 *         realLast: Doe
 *         fanName: A Clever Civette
 *         displayName: A Clever Civette
 */
/**
 * @swagger
 * tags:
 *   name: Reports
 *   description:
 * /reports/sponsors:
 *   get:
 *     summary: Lists all the reports
 *     tags: [Reports]
 *     security:
 *       - ApiKey: []
 *     responses:
 *       200:
 *         description: The list of sponsor or higher tier badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportSponsors'
 *       401:
 *         description: Unauthorized. Authentication is required.
 *         content:
 *           text/plain:
 *             example: Unauthorized
 *       403:
 *         description: Forbidden. Your token likely expired.
 *         content:
 *           text/plain:
 *             example: Forbidden
 */
const express = require("express");
const router = express.Router();
const db = require("../util/db");

router.get("/sponsors", function (req, res) {
	db.getReportSponsor(function(error, data) {
		if (error) throw error;
		res.status(200).json(data);
	})
});

module.exports = router;
