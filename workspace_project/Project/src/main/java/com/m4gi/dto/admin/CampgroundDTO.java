package com.m4gi.dto.admin;

public class CampgroundDTO {
    private String id;
    private String name;
    private String location;
    private String description;
    private String status = "운영중"; // 기본값

    public CampgroundDTO() {}

    public CampgroundDTO(String id, String name, String location, String description) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.description = description;

    }

    public String getId() {return id;}
    public void setId(String id) {this.id = id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public String getLocation() {return location;}
    public void setLocation(String location) {this.location = location;}

    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}

    public String getStatus() {return status;}
    public void setStatus(String status) {this.status = status;}

}
