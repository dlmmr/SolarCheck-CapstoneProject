package org.example.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.dto.UserConditionsDTO;
import org.example.backend.dto.UserInfoDTO;
import org.example.backend.model.Direction;
import org.example.backend.model.UserPvConfig;
import org.example.backend.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String userId;

    @BeforeEach
    void setup() throws Exception {
        userRepository.deleteAll();

        // User erzeugen
        String response = mockMvc.perform(post("/api/home"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        userId = objectMapper.readTree(response).get("userId").asText();
    }

    // ===============================
    // Generate User
    // ===============================
    @Test
    void testGenerateUser() throws Exception {
        mockMvc.perform(post("/api/home"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").exists());
    }

    // ===============================
    // Update UserInfo
    // ===============================
    @Test
    void testUpdateUserinfo_valid() throws Exception {
        UserInfoDTO info = new UserInfoDTO(30, 3, 5000);

        mockMvc.perform(put("/api/home/" + userId + "/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(info)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userInfo.userRateOfElectricity").value(30))
                .andExpect(jsonPath("$.userInfo.userHouseholdNumber").value(3))
                .andExpect(jsonPath("$.userInfo.userElectricityConsumption").value(5000));
    }

    @Test
    void testUpdateUserinfo_invalid() throws Exception {
        UserInfoDTO invalidInfo = new UserInfoDTO(150, 3, 5000); // rate zu hoch

        mockMvc.perform(put("/api/home/" + userId + "/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidInfo)))
                .andExpect(status().isBadRequest());
    }

    // ===============================
    // Update UserConditions
    // ===============================
    @Test
    void testUpdateUserConditions_valid() throws Exception {
        UserConditionsDTO conditions = new UserConditionsDTO(
                UserPvConfig.MEDIUM_PV_COMBI,
                30,
                Direction.SOUTH,
                0.0
        );

        mockMvc.perform(put("/api/home/" + userId + "/conditions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(conditions)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userConditions.userPvConfig").value("MEDIUM_PV_COMBI"))
                .andExpect(jsonPath("$.userConditions.montageAngle").value(30))
                .andExpect(jsonPath("$.userConditions.montageDirection").value("SOUTH"))
                .andExpect(jsonPath("$.userConditions.montageShadeFactor").value(0.0));
    }

    @Test
    void testUpdateUserConditions_invalid() throws Exception {
        UserConditionsDTO invalidConditions = new UserConditionsDTO(
                UserPvConfig.MEDIUM_PV_COMBI,
                150, // ungültiger Winkel > 90
                Direction.SOUTH,
                0.0
        );

        mockMvc.perform(put("/api/home/" + userId + "/conditions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidConditions)))
                .andExpect(status().isBadRequest());
    }

    // ===============================
    // Calculate User Result
    // ===============================
    @Test
    void testCalculateUserResult_success() throws Exception {
        UserInfoDTO info = new UserInfoDTO(30, 3, 5000);
        UserConditionsDTO conditions = new UserConditionsDTO(
                UserPvConfig.MEDIUM_PV_COMBI,
                30,
                Direction.SOUTH,
                0.0
        );

        mockMvc.perform(put("/api/home/" + userId + "/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(info)))
                .andExpect(status().isOk());

        mockMvc.perform(put("/api/home/" + userId + "/conditions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(conditions)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/home/" + userId + "/result"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userResult.userPossibleElectricityGeneration").exists())
                .andExpect(jsonPath("$.userResult.userAmountOfPossibleSavings").exists())
                .andExpect(jsonPath("$.userResult.userAmortisationTime").exists());
    }

    @Test
    void testCalculateUserResult_missingUserInfo() throws Exception {
        UserConditionsDTO conditions = new UserConditionsDTO(
                UserPvConfig.MEDIUM_PV_COMBI,
                30,
                Direction.SOUTH,
                0.0
        );

        mockMvc.perform(put("/api/home/" + userId + "/conditions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(conditions)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/home/" + userId + "/result"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("UserInfo fehlen")));
    }

    @Test
    void testCalculateUserResult_missingUserConditions() throws Exception {
        UserInfoDTO info = new UserInfoDTO(30, 3, 5000);

        mockMvc.perform(put("/api/home/" + userId + "/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(info)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/home/" + userId + "/result"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("UserConditions fehlen")));
    }

    // ===============================
    // Extremwerttests
    // ===============================
    @Test
    void testUpdateUserinfo_extremwerte() throws Exception {
        UserInfoDTO minInfo = new UserInfoDTO(1, 1, 1);
        mockMvc.perform(put("/api/home/" + userId + "/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(minInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userInfo.userRateOfElectricity").value(1))
                .andExpect(jsonPath("$.userInfo.userHouseholdNumber").value(1))
                .andExpect(jsonPath("$.userInfo.userElectricityConsumption").value(1));

        UserInfoDTO maxInfo = new UserInfoDTO(100, 20, 100000);
        mockMvc.perform(put("/api/home/" + userId + "/info")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(maxInfo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userInfo.userRateOfElectricity").value(100))
                .andExpect(jsonPath("$.userInfo.userHouseholdNumber").value(20))
                .andExpect(jsonPath("$.userInfo.userElectricityConsumption").value(100000));
    }

    @Test
    void testUpdateUserConditions_extremwerte() throws Exception {
        UserConditionsDTO minConditions = new UserConditionsDTO(
                UserPvConfig.CHEAP_PV_COMBI,
                0,
                Direction.NORTH,
                0.0
        );

        mockMvc.perform(put("/api/home/" + userId + "/conditions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(minConditions)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userConditions.montageAngle").value(0))
                .andExpect(jsonPath("$.userConditions.montageShadeFactor").value(0.0))
                .andExpect(jsonPath("$.userConditions.montageDirection").value("NORTH"))
                .andExpect(jsonPath("$.userConditions.userPvConfig").value("CHEAP_PV_COMBI"));

        UserConditionsDTO maxConditions = new UserConditionsDTO(
                UserPvConfig.PREMIUM_PV_COMBI,
                90,
                Direction.SOUTHWEST,
                1.0
        );

        mockMvc.perform(put("/api/home/" + userId + "/conditions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(maxConditions)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userConditions.montageAngle").value(90))
                .andExpect(jsonPath("$.userConditions.montageShadeFactor").value(1.0))
                .andExpect(jsonPath("$.userConditions.montageDirection").value("SOUTHWEST"))
                .andExpect(jsonPath("$.userConditions.userPvConfig").value("PREMIUM_PV_COMBI"));
    }

    // ===============================
    // IllegalArgumentHandler Test
    // ===============================
    @Test
    void testIllegalArgumentHandler_direct() throws Exception {
        mockMvc.perform(post("/api/home")) // POST existiert
                .andExpect(status().isOk());
    }

}
