const pool = require("../../../utils/db");
const { v4: uuid } = require("uuid");
const argon2 = require("argon2");
const { verifyUniversity } = require("../../../services/university_validation");

async function institute_register(req, res) {
  const { institute_id, institute_data, password } = req.body;

  if (!institute_id || !institute_data || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // Extract universityDetails from institute_data
    const uniDetails = institute_data.universityDetails
    const contactDetails = institute_data.contactDetails
    // Verify the university details
    const verificationResult = await verifyUniversity({
      name:uniDetails.universityName,
      email:uniDetails.email,
      address:`${uniDetails.universityDetails} ${uniDetails.district} ${uniDetails.state}, ${uniDetails.pincode}`,
      adminPhone:contactDetails.phone,
      category:uniDetails.instituteType
    });
    console.log(verificationResult)
    if (!verificationResult.valid) {
      return res.status(400).json({
        success: false,
        message: `University verification failed: ${verificationResult.reason}`,
      });
    }

    // Generate unique ID for the institute
    const id = uuid();

    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Insert data into the database
    const query = `
      INSERT INTO institute (id, institute_id, institute_data, password)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(query, [id, institute_id, institute_data, hashedPassword]);

    return res.status(201).json({
      success: true,
      message: "Institute registered successfully",
      token: id,
    });
  } catch (error) {
    console.error("Error during institute registration:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration.",
    });
  }
}

const checkInstituteId = async (req, res) => {
  const { institute_id } = req.body;

  if (!institute_id) {
    return res.status(400).json({ success: false, message: "institute_id is required." });
  }

  try {
    // Query the database to check for the institute_id
    const query = `SELECT COUNT(*) FROM institute WHERE institute_id = $1`;
    const result = await pool.query(query, [institute_id]);

    // Check if the institute_id exists
    const exists = result.rows[0].count > 0;

    return res.status(200).json({
      success: exists,
      message: exists ? "Institute ID exists." : "Institute ID does not exist.",
    });
  } catch (error) {
    console.error("Error checking institute_id:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking the institute ID.",
    });
  }
};

const checkEmailForInstitute = async (institute_id) => {
  try {
    const query = `
      SELECT institute_data->'universityDetails'->>'email' AS email
      FROM institute
      WHERE institute_id = $1
    `;
    const result = await pool.query(query, [institute_id]);
    return result.rows[0].email
  }
  catch (err) {
    return undefined
  }
}


// Function to handle institute login
const loginInstitute = async (req, res) => {
  const { institute_id, password } = req.body;

  // Validate input
  if (!institute_id || !password) {
    return res.status(400).json({
      success: false,
      message: "Both institute_id and password are required.",
    });
  }

  try {
    // Fetch the stored password hash for the given institute_id
    const query = `
      SELECT password, id
      FROM institute
      WHERE institute_id = $1
    `;
    const result = await pool.query(query, [institute_id]);

    // Check if the institute_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Institute ID not found.",
      });
    }

    const storedPasswordHash = result.rows[0].password;

    const isPasswordValid = await argon2.verify(storedPasswordHash, password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token: result.rows[0].id
    });
  } catch (error) {
    console.error("Error during institute login:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
}


const resetPassword = async (req, res) => {
  const { institute_id, password } = req.body;

  if (!institute_id || !password) {
    return res.status(400).json({ success: false, message: "Required fields missing." });
  }

  try {
    const hashedPassword = await argon2.hash(password);

    const updateQuery = `UPDATE institute SET password = $1 WHERE institute_id = $2`;
    await pool.query(updateQuery, [hashedPassword, institute_id]);

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in resetting password:", error);
    return res.status(500).json({ success: false, message: "An error occurred." });
  }
}


module.exports = {
  institute_register,
  checkInstituteId,
  checkEmailForInstitute,
  loginInstitute,
  resetPassword
}   