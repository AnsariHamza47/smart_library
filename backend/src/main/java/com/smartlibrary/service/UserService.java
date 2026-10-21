package com.smartlibrary.service;

import com.smartlibrary.dto.RegisterRequest;
import com.smartlibrary.entity.Role;
import com.smartlibrary.entity.User;
import com.smartlibrary.exception.BadRequestException;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.LoanRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, LoanRepository loanRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.STUDENT,
                request.getStudentId(),
                request.getDepartment()
        );

        return userRepository.save(user);
    }

    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public User toggleUserActive(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    @Transactional
    public User updateProfile(Long id, String fullName, String department) {
        User user = getUserById(id);
        if (fullName != null && !fullName.trim().isEmpty()) {
            user.setFullName(fullName.trim());
        }
        if (department != null && !department.trim().isEmpty()) {
            user.setDepartment(department.trim());
        }
        return userRepository.save(user);
    }

    @Transactional
    public void deleteStudent(Long id) {
        User user = getUserById(id);
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Administrative accounts cannot be deleted.");
        }
        long activeLoans = loanRepository.countActiveLoansByUserId(id);
        if (activeLoans > 0) {
            throw new BadRequestException("Cannot delete student \"" + user.getFullName() +
                    "\" because they have " + activeLoans + " active borrowed books. All books must be returned first.");
        }
        userRepository.delete(user);
    }
}
