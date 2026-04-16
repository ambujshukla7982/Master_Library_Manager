package com.lms.config;

import com.lms.model.Book;
import com.lms.model.enums.MainCategory;
import com.lms.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class BookDataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        if (bookRepository.count() > 10) {
            log.info("Books already seeded ({} books found). Skipping mass seeding.", bookRepository.count());
            return;
        }

        log.info("Starting mass seeding of 1000 books...");
        
        List<CategoryInfo> categories = getCategories();
        List<Book> allBooks = new ArrayList<>();

        for (CategoryInfo cat : categories) {
            for (int i = 1; i <= 50; i++) {
                allBooks.add(generateBook(cat, i));
            }
        }

        bookRepository.saveAll(allBooks);
        log.info("Successfully seeded 1000 books across 20 categories.");
    }

    private Book generateBook(CategoryInfo cat, int index) {
        String title = cat.prefixes[random.nextInt(cat.prefixes.length)] + " " + 
                       cat.topics[random.nextInt(cat.topics.length)] + " " + 
                       cat.suffixes[random.nextInt(cat.suffixes.length)] + " (Vol. " + index + ")";
        
        String author = AUTHORS[random.nextInt(AUTHORS.length)];
        String isbn = "978-" + String.format("%010d", Math.abs(random.nextLong()) % 10000000000L);
        int year = 1990 + random.nextInt(35);
        int copies = 3 + random.nextInt(6);

        return Book.builder()
                .title(title)
                .author(author)
                .isbn(isbn)
                .mainCategory(cat.mainCategory)
                .subCategory(cat.subCategory)
                .genre(cat.genre)
                .publicationYear(year)
                .publisher(PUBLISHERS[random.nextInt(PUBLISHERS.length)])
                .totalCopies(copies)
                .availableCopies(copies)
                .description("A comprehensive guide on " + cat.genre + " covering essential concepts and advanced techniques for students and professionals.")
                .language("English")
                .build();
    }

    private static class CategoryInfo {
        MainCategory mainCategory;
        String subCategory;
        String genre;
        String[] prefixes;
        String[] topics;
        String[] suffixes;

        CategoryInfo(MainCategory mc, String sc, String g, String[] p, String[] t, String[] s) {
            this.mainCategory = mc;
            this.subCategory = sc;
            this.genre = g;
            this.prefixes = p;
            this.topics = t;
            this.suffixes = s;
        }
    }

    private List<CategoryInfo> getCategories() {
        return List.of(
            new CategoryInfo(MainCategory.COLLEGE, "COMPUTER_SCIENCE", "Computer Science", 
                new String[]{"Advanced", "Introduction to", "Mastering", "Principles of"},
                new String[]{"Data Structures", "Algorithms", "Cloud Computing", "Networking", "Database Systems"},
                new String[]{"for Engineers", "Handbook", "in Practice", "Fundamentals"}),
            new CategoryInfo(MainCategory.COLLEGE, "ELECTRONICS_ELECTRICAL", "Electronics",
                new String[]{"Digital", "Analog", "Power", "Applied", "Modern"},
                new String[]{"Circuits", "Control Systems", "Signal Processing", "Microprocessors", "VLSI"},
                new String[]{"Essentials", "Applications", "Design", "Analysis"}),
            new CategoryInfo(MainCategory.COLLEGE, "MECHANICAL", "Mechanical Engineering",
                new String[]{"Fluid", "Solid", "Thermal", "Applied", "Industrial"},
                new String[]{"Mechanics", "Thermodynamics", "Robotics", "Manufacturing", "Heat Transfer"},
                new String[]{"Techniques", "Theory", "Processes", "Systems"}),
            new CategoryInfo(MainCategory.COLLEGE, "CIVIL", "Civil Engineering",
                new String[]{"Structural", "Environmental", "Geotechnical", "Urban", "Hydraulic"},
                new String[]{"Analysis", "Transportation", "Surveying", "Construction", "Concrete"},
                new String[]{"Methods", "Planning", "Management", "Materials"}),
            new CategoryInfo(MainCategory.COLLEGE, "MATHEMATICS", "Mathematics",
                new String[]{"Higher", "Discrete", "Applied", "Elementary", "Advanced"},
                new String[]{"Calculus", "Linear Algebra", "Vector Analysis", "Statistics", "Differential Equations"},
                new String[]{"for Science", "Workbook", "Concepts", "Tutorial"}),
            new CategoryInfo(MainCategory.COLLEGE, "PHYSICS", "Physics",
                new String[]{"Quantum", "Theoretical", "Computational", "Experimental", "General"},
                new String[]{"Mechanics", "Electrodynamics", "Optics", "Nuclear Physics", "Solid State"},
                new String[]{"Foundations", "Laws", "Principles", "Insights"}),
            new CategoryInfo(MainCategory.COLLEGE, "CHEMISTRY", "Chemistry",
                new String[]{"Organic", "Inorganic", "Physical", "Analytical", "Industrial"},
                new String[]{"Chemistry", "Biochemistry", "Molecular Dynamics", "Kinetics", "Polymers"},
                new String[]{"Guide", "Reference", "Textbook", "Laboratory"}),
            new CategoryInfo(MainCategory.COLLEGE, "MEDICAL_HEALTHCARE", "Medical",
                new String[]{"Clinical", "Surgical", "Emergency", "Molecular", "Integrative"},
                new String[]{"Anatomy", "Pathology", "Physiology", "Pharmacology", "Neurology"},
                new String[]{"Companion", "Standard", "Review", "Practice"}),
            new CategoryInfo(MainCategory.COLLEGE, "LAW_LEGAL", "Law",
                new String[]{"Criminal", "Constitutional", "Corporate", "International", "Civil"},
                new String[]{"Law", "Jurisprudence", "Legal Procedures", "Justice", "Contracts"},
                new String[]{"Digest", "Manual", "Cases", "Statutes"}),
            new CategoryInfo(MainCategory.COLLEGE, "COMMERCE_ACCOUNTING", "Commerce",
                new String[]{"Financial", "Corporate", "Cost", "Management", "Advanced"},
                new String[]{"Accounting", "Auditing", "Taxation", "Banking", "Insurance"},
                new String[]{"Principles", "Practices", "Standards", "Framework"}),
            new CategoryInfo(MainCategory.COLLEGE, "MANAGEMENT_MBA", "Management",
                new String[]{"Strategic", "Organizational", "Operational", "Human Resource", "International"},
                new String[]{"Management", "Business Ethics", "Leadership", "Marketing", "Finance"},
                new String[]{"Strategy", "Case Studies", "Perspective", "Excellence"}),
            new CategoryInfo(MainCategory.COLLEGE, "ARTS_HUMANITIES", "Arts",
                new String[]{"Modern", "Contemporary", "Classical", "Visual", "Global"},
                new String[]{"History", "Philosophy", "Anthropology", "Culture", "Design"},
                new String[]{"Expressions", "Studies", "Exploration", "Theory"}),
            new CategoryInfo(MainCategory.COLLEGE, "ENGLISH_LITERATURE", "English Literature",
                new String[]{"British", "American", "Classic", "Modern", "Renaissance"},
                new String[]{"Poetry", "Drama", "Fiction", "Literary Criticism", "Prose"},
                new String[]{"Collection", "Anthology", "Readings", "Analyses"}),
            new CategoryInfo(MainCategory.COLLEGE, "ECONOMICS", "Economics",
                new String[]{"Micro", "Macro", "Behavioral", "Development", "Global"},
                new String[]{"Economics", "Econometrics", "Public Finance", "Trade", "Policy"},
                new String[]{"Models", "Indicators", "Principles", "Impact"}),
            new CategoryInfo(MainCategory.COLLEGE, "PSYCHOLOGY_SOCIOLOGY", "Psychology",
                new String[]{"Social", "Cognitive", "Developmental", "Abnormal", "Educational"},
                new String[]{"Psychology", "Sociology", "Behavior", "Research", "Society"},
                new String[]{"Observations", "Theories", "Concepts", "Study"}),
            new CategoryInfo(MainCategory.COLLEGE, "DATA_SCIENCE_AI_ML", "Data Science",
                new String[]{"Deep", "Machine", "Statistical", "Predictive", "Practical"},
                new String[]{"Learning", "Artificial Intelligence", "Big Data", "Neural Networks", "NLP"},
                new String[]{"Applications", "Algorithms", "Toolkit", "Modern"}),
            new CategoryInfo(MainCategory.COMPETITIVE_EXAM, "COMPETITIVE_EXAM_PREP", "Exam Prep",
                new String[]{"Ultimate", "Complete", "Shortcuts to", "Cracking", "Quick"},
                new String[]{"Aptitude", "Reasoning", "General Awareness", "Logical Thinking", "Interview"},
                new String[]{"Strategy", "Guidebook", "Quick Reference", "Mastery"}),
            new CategoryInfo(MainCategory.COLLEGE, "ENVIRONMENT_AGRICULTURE", "Environment",
                new String[]{"Sustainable", "Green", "Applied", "Global", "Modern"},
                new String[]{"Agriculture", "Ecology", "Environment Studies", "Climate Change", "Forestry"},
                new String[]{"Management", "Solutions", "Impact", "Development"}),
            new CategoryInfo(MainCategory.COLLEGE, "ARCHITECTURE_DESIGN", "Architecture",
                new String[]{"Modern", "Sustainable", "Urban", "Interior", "Digital"},
                new String[]{"Architecture", "Design Principles", "Drafting", "Construction", "History"},
                new String[]{"Basics", "Advanced", "Visuals", "Projects"}),
            new CategoryInfo(MainCategory.OTHER, "GENERAL_KNOWLEDGE", "General Knowledge",
                new String[]{"Daily", "Master", "Concise", "World", "Illustrated"},
                new String[]{"General Knowledge", "Current Affairs", "Facts", "Quiz", "Trivia"},
                new String[]{"Encyclopedia", "Yearbook", "Reference", "Guide"})
        );
    }

    private static final String[] AUTHORS = {
        "Thomas H. Cormen", "Robert C. Martin", "Sedra Smith", "Shigley Joseph", "Kreyszig Erwin",
        "H.C. Verma", "M. Laxmikanth", "R.S. Aggarwal", "Peter Atkins", "John Kotler",
        "William Shakespeare", "Jane Austen", "George Orwell", "Frank Herbert", "James Clear",
        "Yuval Noah Harari", "Ramachandra Guha", "Bipin Chandra", "Stephen Hawking", "Albert Einstein"
    };

    private static final String[] PUBLISHERS = {
        "O'Reilly Media", "McGraw Hill", "Pearson", "Oxford University Press", "Cambridge",
        "Springer", "Wiley", "Penguin Random House", "HarperCollins", "Khanna Publishers"
    };
}
