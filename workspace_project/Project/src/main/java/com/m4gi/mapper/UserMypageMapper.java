package com.m4gi.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.m4gi.dto.UserDTO;

@Mapper
public interface UserMypageMapper {
	  @Select("SELECT nickname, profile_image FROM users WHERE provider_code = #{providerCode} AND provider_user_id = #{providerUserId}")
	    UserDTO findUserById(@Param("providerCode") int providerCode, @Param("providerUserId") String providerUserId);


}
