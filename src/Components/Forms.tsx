import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Country, State } from "country-state-city";
import { useState } from "react";
import supabase from "../supabase/supabase";

export default function MarriageInstituteForm() {
  const [formValues, setFormValues] = useState<any>({});
  const [states, setStates] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const countries = Country.getAllCountries();

  const handleChange = (field: string, value: any) => {
    setFormValues((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (code: string) => {
    handleChange("country", code);
    const countryStates = State.getStatesOfCountry(code);
    setStates(countryStates);
    handleChange("state", "");
  };

  const handleStateChange = (code: string) => {
    handleChange("state", code);
  };

  const validateForm = () => {
    let newErrors: any = {};
    if (!formValues.name) newErrors.name = "Name is required.";
    if (!formValues.gender) newErrors.gender = "Gender is required.";
    if (!formValues.email || !/\S+@\S+\.\S+/.test(formValues.email))
      newErrors.email = "Valid email is required.";
    if (!formValues.phone || !/^\d+$/.test(formValues.phone))
      newErrors.phone = "Phone must contain only digits.";
    if (!formValues.dob) newErrors.dob = "Date of birth is required.";
    if (!formValues.country) newErrors.country = "Country is required.";
    if (!formValues.state) newErrors.state = "State is required.";
    if (!formValues.bornAgain) newErrors.bornAgain = "Please select an option.";
    if (!formValues.church) newErrors.church = "Church name is required.";
    if (!formValues.partnerOnGroup)
      newErrors.partnerOnGroup = "Please select an option.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Form incomplete",
        description: "Please fix the highlighted errors.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    // Map form values to DB column names
    const payload = {
      name: formValues.name,
      gender: formValues.gender,
      email: formValues.email,
      phone: formValues.phone,
      date_of_birth: formValues.dob,
      country_residence: formValues.country,
      state_residence: formValues.state,
      born_again: formValues.bornAgain,
      church: formValues.church,
      partner_on_group: formValues.partnerOnGroup,
      partner_name: formValues.partnerName || "",
      parental_consent: formValues.parentalConsent || "",
      wedding_date: formValues.weddingDate || null,
      pro_wed_date: formValues.proposedWeddingDate || null,
      virtual_class: formValues.virtualClasses || "",
      privy_contact: formValues.witness || "",
    };

    const { error } = await supabase
      .from("Marriage Institute")
      .insert([payload]);

    setLoading(false);

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Form submitted",
        description: "Your response has been saved successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormValues({});
      setStates([]);
    }
  };

  return (
    <Box maxW="700px" mx="auto" p={8} bg="gray.800" color="white" rounded="xl">
      <Heading mb={6} textAlign="center">
        Marriage Institute Interview Form
      </Heading>

      <Stack spacing={4}>
        {/* Name */}
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter full name"
            value={formValues.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        {/* Gender */}
        <FormControl isInvalid={!!errors.gender}>
          <FormLabel>Gender</FormLabel>
          <Select
            placeholder="Select gender"
            value={formValues.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option style={{ color: "black" }} value="male">
              Male
            </option>
            <option style={{ color: "black" }} value="female">
              Female
            </option>
          </Select>
          <FormErrorMessage>{errors.gender}</FormErrorMessage>
        </FormControl>

        {/* Email */}
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter email address"
            value={formValues.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        {/* Phone */}
        <FormControl isInvalid={!!errors.phone}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            placeholder="Digits only"
            value={formValues.phone || ""}
            onChange={(e) =>
              handleChange("phone", e.target.value.replace(/\D/g, ""))
            }
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>

        {/* Date of Birth */}
        <FormControl isInvalid={!!errors.dob}>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            value={formValues.dob || ""}
            onChange={(e) => handleChange("dob", e.target.value)}
          />
          <FormErrorMessage>{errors.dob}</FormErrorMessage>
        </FormControl>

        {/* Country */}
        <FormControl isInvalid={!!errors.country}>
          <FormLabel>Country</FormLabel>
          <Select
            placeholder="Select country"
            value={formValues.country || ""}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.country}</FormErrorMessage>
        </FormControl>

        {/* State */}
        <FormControl isInvalid={!!errors.state}>
          <FormLabel>State</FormLabel>
          <Select
            placeholder="Select State"
            value={formValues.state || ""}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.state}</FormErrorMessage>
        </FormControl>

        {/* Born Again */}
        <FormControl isInvalid={!!errors.bornAgain}>
          <FormLabel>Born Again?</FormLabel>
          <Select
            placeholder="Select option"
            value={formValues.bornAgain || ""}
            onChange={(e) => handleChange("bornAgain", e.target.value)}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
          <FormErrorMessage>{errors.bornAgain}</FormErrorMessage>
        </FormControl>

        {/* Church */}
        <FormControl isInvalid={!!errors.church}>
          <FormLabel>Church</FormLabel>
          <Input
            placeholder="Enter church name"
            value={formValues.church || ""}
            onChange={(e) => handleChange("church", e.target.value)}
          />
          <FormErrorMessage>{errors.church}</FormErrorMessage>
        </FormControl>

        {/* Partner on group */}
        <FormControl isInvalid={!!errors.partnerOnGroup}>
          <FormLabel>Is partner on the group?</FormLabel>
          <Select
            placeholder="Select option"
            value={formValues.partnerOnGroup || ""}
            onChange={(e) => handleChange("partnerOnGroup", e.target.value)}
          >
            <option style={{ color: "black" }} value="yes">
              Yes
            </option>
            <option style={{ color: "black" }} value="no">
              No
            </option>
          </Select>
          <FormErrorMessage>{errors.partnerOnGroup}</FormErrorMessage>
        </FormControl>

        {/* Partner Name */}
        <FormControl>
          <FormLabel>Name of Partner</FormLabel>
          <Input
            placeholder="Enter partner's name"
            value={formValues.partnerName || ""}
            onChange={(e) => handleChange("partnerName", e.target.value)}
          />
        </FormControl>

        {/* Parental Consent */}
        <FormControl>
          <FormLabel>Parental Consent on Relationship</FormLabel>
          <Select
            placeholder="Select option"
            value={formValues.parentalConsent || ""}
            onChange={(e) => handleChange("parentalConsent", e.target.value)}
          >
            <option style={{ color: "black" }} value="yes">
              Yes
            </option>
            <option style={{ color: "black" }} value="no">
              No
            </option>
          </Select>
        </FormControl>

        {/* Wedding Date */}
        <FormControl>
          <FormLabel>Wedding Date (if married)</FormLabel>
          <Input
            type="date"
            value={formValues.weddingDate || ""}
            onChange={(e) => handleChange("weddingDate", e.target.value)}
          />
        </FormControl>

        {/* Proposed Wedding Date */}
        <FormControl>
          <FormLabel>Proposed Wedding Date (if engaged)</FormLabel>
          <Input
            type="date"
            value={formValues.proposedWeddingDate || ""}
            onChange={(e) =>
              handleChange("proposedWeddingDate", e.target.value)
            }
          />
        </FormControl>

        {/* Virtual Classes */}
        <FormControl>
          <FormLabel>
            Can you attend virtual classes on TUESDAY and SUNDAY evenings (9–11
            PM)?
          </FormLabel>
          <Select
            placeholder="Yes or No"
            value={formValues.virtualClasses || ""}
            onChange={(e) => handleChange("virtualClasses", e.target.value)}
          >
            <option style={{ color: "black" }} value="yes">
              Yes
            </option>
            <option style={{ color: "black" }} value="no">
              No
            </option>
          </Select>
        </FormControl>

        {/* Witness Info */}
        <FormControl>
          <FormLabel>
            Name and contact of a witness privy to your relationship (engaged
            only)
          </FormLabel>
          <Textarea
            placeholder="Enter witness name and contact"
            value={formValues.witness || ""}
            onChange={(e) => handleChange("witness", e.target.value)}
          />
        </FormControl>

        {/* Submit */}
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
}
